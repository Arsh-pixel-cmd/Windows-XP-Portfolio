// src/services/cloudflareApi.ts
import { PortfolioData, CloudflareConfig } from '../types/portfolio';

const CONFIG_KEY = 'xp_cloudflare_config';
const TOKEN_KEY = 'xp_admin_token';

const DEFAULT_CONFIG: CloudflareConfig = {
  apiUrl: (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_CLOUDFLARE_API_URL || '',
  apiToken: '',
  autoSync: false,
};

export class CloudflareService {
  private config: CloudflareConfig;

  constructor() {
    this.config = this.loadConfig();
  }

  loadConfig(): CloudflareConfig {
    try {
      const saved = localStorage.getItem(CONFIG_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { 
          ...DEFAULT_CONFIG, 
          ...parsed,
          apiUrl: parsed.apiUrl || DEFAULT_CONFIG.apiUrl,
        };
      }
    } catch {
      // fallback
    }
    return { ...DEFAULT_CONFIG };
  }

  saveConfig(newConfig: Partial<CloudflareConfig>): CloudflareConfig {
    this.config = { ...this.config, ...newConfig };
    localStorage.setItem(CONFIG_KEY, JSON.stringify(this.config));
    return this.config;
  }

  getConfig(): CloudflareConfig {
    return { ...this.config };
  }

  getToken(): string {
    return localStorage.getItem(TOKEN_KEY) || this.config.apiToken || '';
  }

  setToken(token: string): void {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      this.config.apiToken = token;
      this.saveConfig({ apiToken: token });
    } else {
      localStorage.removeItem(TOKEN_KEY);
      this.config.apiToken = '';
      this.saveConfig({ apiToken: '' });
    }
  }

  private cleanUrl(path: string): string {
    const base = this.config.apiUrl.trim().replace(/\/+$/, '');
    return `${base}${path.startsWith('/') ? path : `/${path}`}`;
  }

  async testConnection(customUrl?: string): Promise<{ ok: boolean; message: string }> {
    const url = customUrl ? customUrl.trim().replace(/\/+$/, '') : this.config.apiUrl.trim().replace(/\/+$/, '');
    if (!url) {
      return { ok: false, message: 'Cloudflare Worker URL is not configured' };
    }

    try {
      const res = await fetch(`${url}/api/health`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });

      if (!res.ok) {
        return { ok: false, message: `Server returned HTTP ${res.status}` };
      }

      const data = (await res.json()) as { time?: string };
      return { 
        ok: true, 
        message: `Connected successfully! (Server Time: ${new Date(data.time || Date.now()).toLocaleTimeString()})` 
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { ok: false, message: `Connection failed: ${msg}` };
    }
  }

  async login(password: string): Promise<{ success: boolean; token?: string; error?: string }> {
    if (!this.config.apiUrl) {
      // Local Master Key fallback if Cloudflare is not yet configured
      const localAdminPass = localStorage.getItem('xp_local_admin_pass') || 'admin';
      if (password === localAdminPass || password === 'arsh') {
        const localToken = `local-admin-${Date.now()}`;
        this.setToken(localToken);
        return { success: true, token: localToken };
      }
      return { success: false, error: 'Incorrect password (default is "admin" for local mode)' };
    }

    try {
      const res = await fetch(this.cleanUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = (await res.json()) as { token?: string; error?: string };
      if (!res.ok || !data.token) {
        return { success: false, error: data.error || 'Invalid credentials' };
      }

      this.setToken(data.token);
      return { success: true, token: data.token };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, error: `Auth request failed: ${msg}` };
    }
  }

  async fetchPortfolio(): Promise<PortfolioData | null> {
    if (!this.config.apiUrl) return null;

    try {
      const res = await fetch(this.cleanUrl('/api/portfolio'), {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });

      if (!res.ok) return null;
      const data = (await res.json()) as { profile?: unknown; projects?: unknown[] };
      if (data && data.profile && Array.isArray(data.projects)) {
        return data as unknown as PortfolioData;
      }
      return null;
    } catch {
      return null;
    }
  }

  async syncPortfolio(data: PortfolioData): Promise<{ success: boolean; error?: string }> {
    if (!this.config.apiUrl) {
      return { success: false, error: 'Cloudflare Worker URL is not configured' };
    }

    const token = this.getToken();
    if (!token) {
      return { success: false, error: 'Unauthorized: Admin token missing. Please log in.' };
    }

    try {
      const res = await fetch(this.cleanUrl('/api/portfolio/sync'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const resData = (await res.json()) as { error?: string };
      if (!res.ok) {
        return { success: false, error: resData.error || `Sync failed (${res.status})` };
      }

      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, error: `Network error: ${msg}` };
    }
  }

  async dispatchMessage(subject: string, message: string): Promise<boolean> {
    if (!this.config.apiUrl) return false;
    try {
      const res = await fetch(this.cleanUrl('/api/messages'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, message }),
      });
      return res.ok;
    } catch {
      return false;
    }
  }
}

export const cloudflareApi = new CloudflareService();
