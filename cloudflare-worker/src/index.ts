/**
 * Cloudflare Worker API for Windows XP Portfolio
 * Backed by Cloudflare D1
 */

export interface Env {
  DB: D1Database;
  ADMIN_PASSWORD?: string; // Optional environment secret
  CORS_ORIGIN?: string;
}

// Simple SHA-256 helper with Web Crypto
async function sha256(text: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function corsHeaders(env: Env) {
  return {
    'Access-Control-Allow-Origin': env.CORS_ORIGIN || '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}

function jsonResponse(data: unknown, status = 200, env: Env) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(env),
    },
  });
}

// Authentication Check
async function isAuthorized(request: Request, env: Env): Promise<boolean> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  const token = authHeader.substring(7);

  // 1. Check against D1 session token
  try {
    const row = await env.DB.prepare(
      'SELECT token, token_expiry FROM admin_auth WHERE id = "admin"'
    ).first<{ token: string; token_expiry: number }>();

    if (row && row.token === token && row.token_expiry > Date.now()) {
      return true;
    }
  } catch {
    // If D1 table not yet initialized, fallback to hash matching
  }

  // 2. Direct secret match if token matches hash of ADMIN_PASSWORD
  const expectedSecret = env.ADMIN_PASSWORD || 'arsh-admin-2026';
  const expectedToken = await sha256(expectedSecret);
  return token === expectedToken;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders(env) });
    }

    try {
      // 1. Health / Ping / Root Info
      if (url.pathname === '/' || url.pathname === '/api/health' || url.pathname === '/health') {
        return jsonResponse({
          status: 'ok',
          service: 'Windows XP Portfolio API',
          d1Ready: Boolean(env.DB),
          time: Date.now(),
          endpoints: [
            '/api/portfolio',
            '/api/health',
            '/api/auth/login',
            '/api/auth/verify',
            '/api/portfolio/sync',
            '/api/messages',
          ],
        }, 200, env);
      }

      // 2. Auth: Login
      if (url.pathname === '/api/auth/login' && request.method === 'POST') {
        const body = await request.json() as { password?: string };
        const password = body.password || '';
        const adminPass = env.ADMIN_PASSWORD || 'arsh-admin-2026';

        // Check if custom password in D1
        let valid = false;
        try {
          const authRow = await env.DB.prepare('SELECT password_hash FROM admin_auth WHERE id = "admin"').first<{ password_hash: string }>();
          if (authRow && authRow.password_hash) {
            const inputHash = await sha256(password);
            valid = inputHash === authRow.password_hash;
          } else {
            valid = password === adminPass;
          }
        } catch {
          valid = password === adminPass;
        }

        if (!valid) {
          return jsonResponse({ error: 'Invalid administrator password' }, 401, env);
        }

        // Generate token
        const token = crypto.randomUUID();
        const expiry = Date.now() + 1000 * 60 * 60 * 24 * 7; // 7 days

        try {
          await env.DB.prepare(`
            INSERT INTO admin_auth (id, password_hash, salt, token, token_expiry, updated_at)
            VALUES ("admin", ?, "", ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET token = ?, token_expiry = ?, updated_at = ?
          `).bind(await sha256(password), token, expiry, Date.now(), token, expiry, Date.now()).run();
        } catch {
          // If table not ready, return hashed password as fallback token
        }

        return jsonResponse({ success: true, token, expiry, user: { username: 'Arsh', role: 'admin' } }, 200, env);
      }

      // 3. Auth: Verify
      if (url.pathname === '/api/auth/verify' && request.method === 'GET') {
        const authorized = await isAuthorized(request, env);
        if (!authorized) {
          return jsonResponse({ authenticated: false }, 401, env);
        }
        return jsonResponse({ authenticated: true, user: { username: 'Arsh', role: 'admin' } }, 200, env);
      }

      // 4. Portfolio: Get All Data (Public)
      if (url.pathname === '/api/portfolio' && request.method === 'GET') {
        const profile = await env.DB.prepare('SELECT * FROM profile WHERE id = "main"').first();
        const projects = await env.DB.prepare('SELECT * FROM projects ORDER BY sort_order ASC, updated_at DESC').all();
        const skills = await env.DB.prepare('SELECT * FROM skills ORDER BY sort_order ASC').all();
        const experiments = await env.DB.prepare('SELECT * FROM experiments ORDER BY sort_order ASC').all();

        return jsonResponse({
          profile: profile ? {
            ...profile,
            core_focus: profile.core_focus ? JSON.parse(profile.core_focus as string) : [],
          } : null,
          projects: projects.results.map((p: Record<string, unknown>) => ({
            ...p,
            tech: typeof p.tech === 'string' ? JSON.parse(p.tech) : p.tech,
            details: typeof p.details === 'string' ? JSON.parse(p.details) : p.details,
          })),
          skills: skills.results.map((s: Record<string, unknown>) => ({
            ...s,
            items: typeof s.items === 'string' ? JSON.parse(s.items) : s.items,
          })),
          experiments: experiments.results,
        }, 200, env);
      }

      // 5. Portfolio: Full Sync (Admin Protected)
      if (url.pathname === '/api/portfolio/sync' && request.method === 'POST') {
        if (!(await isAuthorized(request, env))) {
          return jsonResponse({ error: 'Unauthorized' }, 401, env);
        }

        const data = (await request.json()) as {
          profile?: Record<string, unknown>;
          projects?: Array<Record<string, unknown>>;
          skills?: Array<Record<string, unknown>>;
          experiments?: Array<Record<string, unknown>>;
        };
        const now = Date.now();

        // Save profile
        if (data.profile) {
          const p = data.profile;
          await env.DB.prepare(`
            INSERT INTO profile (id, name, title, headline, bio, location, email, github, linkedin, quote, core_focus, philosophy, resume_content, updated_at)
            VALUES ("main", ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
              name = excluded.name,
              title = excluded.title,
              headline = excluded.headline,
              bio = excluded.bio,
              location = excluded.location,
              email = excluded.email,
              github = excluded.github,
              linkedin = excluded.linkedin,
              quote = excluded.quote,
              core_focus = excluded.core_focus,
              philosophy = excluded.philosophy,
              resume_content = excluded.resume_content,
              updated_at = excluded.updated_at
          `).bind(
            p.name || '', p.title || '', p.headline || '', p.bio || '',
            p.location || '', p.email || '', p.github || '', p.linkedin || '',
            p.quote || '', JSON.stringify(p.core_focus || []), p.philosophy || '',
            p.resume_content || '', now
          ).run();
        }

        // Save projects
        if (Array.isArray(data.projects)) {
          await env.DB.prepare('DELETE FROM projects').run();
          for (let i = 0; i < data.projects.length; i++) {
            const pr = data.projects[i];
            await env.DB.prepare(`
              INSERT INTO projects (id, title, description, impact, tech, details, status, github, link, sort_order, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).bind(
              pr.id || `proj-${i}`, pr.title, pr.description || '', pr.impact || '',
              JSON.stringify(pr.tech || []), JSON.stringify(pr.details || []),
              pr.status || '', pr.github || '', pr.link || '', i, now
            ).run();
          }
        }

        // Save skills
        if (Array.isArray(data.skills)) {
          await env.DB.prepare('DELETE FROM skills').run();
          for (let i = 0; i < data.skills.length; i++) {
            const sk = data.skills[i];
            await env.DB.prepare(`
              INSERT INTO skills (id, category, items, sort_order)
              VALUES (?, ?, ?, ?)
            `).bind(sk.id || `sk-${i}`, sk.category, JSON.stringify(sk.items || []), i).run();
          }
        }

        // Save experiments
        if (Array.isArray(data.experiments)) {
          await env.DB.prepare('DELETE FROM experiments').run();
          for (let i = 0; i < data.experiments.length; i++) {
            const ex = data.experiments[i];
            await env.DB.prepare(`
              INSERT INTO experiments (id, tag, title, problem, approach, result, sort_order, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `).bind(
              ex.id || `exp-${i}`, ex.tag || `EXP_0${i + 1}`, ex.title,
              ex.problem || '', ex.approach || '', ex.result || '', i, now
            ).run();
          }
        }

        return jsonResponse({ success: true, timestamp: now }, 200, env);
      }

      // 6. Messages: Dispatch (Public)
      if (url.pathname === '/api/messages' && request.method === 'POST') {
        const body = await request.json() as { subject: string; message: string };
        const id = `msg-${Date.now()}`;
        const ip = request.headers.get('cf-connecting-ip') || '';
        await env.DB.prepare(
          'INSERT INTO messages (id, subject, message, sender_ip, created_at) VALUES (?, ?, ?, ?, ?)'
        ).bind(id, body.subject || '', body.message || '', ip, Date.now()).run();

        return jsonResponse({ success: true, messageId: id }, 200, env);
      }

      return jsonResponse({ error: 'Endpoint not found' }, 404, env);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return jsonResponse({ error: message }, 500, env);
    }
  },
};
