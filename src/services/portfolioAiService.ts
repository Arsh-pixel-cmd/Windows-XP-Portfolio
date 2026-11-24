// src/services/portfolioAiService.ts
import { PortfolioData } from '../types/portfolio';
import { AiConfig, AiResponsePayload, PortfolioAiAction } from '../types/ai';
import { portfolioStore } from '../core/portfolioStore';

const AI_CONFIG_KEY = 'xp_ai_config';

function getEnvKeyForProvider(provider: 'gemini' | 'groq' | 'openai'): string {
  try {
    if (provider === 'gemini') {
      return (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_GEMINI_API_KEY || '';
    }
    if (provider === 'groq') {
      return (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_GROQ_API_KEY || '';
    }
    if (provider === 'openai') {
      return (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_OPENAI_API_KEY || '';
    }
  } catch {
    // fallback
  }
  return '';
}

const DEFAULT_CONFIG: AiConfig = {
  provider: 'gemini',
  apiKey: getEnvKeyForProvider('gemini'),
  model: 'gemini-1.5-flash',
  autoApply: false,
};

export class PortfolioAiService {
  private config: AiConfig;

  constructor() {
    this.config = this.loadConfig();
  }

  loadConfig(): AiConfig {
    try {
      const saved = localStorage.getItem(AI_CONFIG_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const provider = parsed.provider || DEFAULT_CONFIG.provider;
        const envKey = getEnvKeyForProvider(provider);
        return {
          ...DEFAULT_CONFIG,
          ...parsed,
          apiKey: parsed.apiKey || envKey,
        };
      }
    } catch {
      // fallback
    }
    const envKey = getEnvKeyForProvider(DEFAULT_CONFIG.provider);
    return { ...DEFAULT_CONFIG, apiKey: envKey };
  }

  saveConfig(updates: Partial<AiConfig>): AiConfig {
    this.config = { ...this.config, ...updates };
    localStorage.setItem(AI_CONFIG_KEY, JSON.stringify(this.config));
    return this.config;
  }

  getConfig(): AiConfig {
    return { ...this.config };
  }

  private buildSystemPrompt(portfolio: PortfolioData): string {
    return `You are the specialized AI Portfolio Engineering Copilot for Arsh Mishra's Windows XP Portfolio.
Your goal is to parse user instructions and generate structured modifications to the portfolio state (projects, profile, skills, experiments).

ARSH MISHRA'S ENGINEERING PERSONA & STANDARDS:
- Title: Full-Stack Engineer | AI Systems Builder
- Philosophy: Architecture > shortcuts | Performance is non-negotiable | Automation > repetition | Deterministic systems, not just interfaces.
- Tone: High-impact, metrics-driven, production-grade, architectural precision. Avoid fluff and buzzwords without substance.
- When generating project bullet points: focus on architecture, latency, throughput, security, concurrency, pipelines, and engineering design decisions.
- When adding skills: categorize them correctly into existing categories (e.g., "Languages", "Frameworks & Libraries", "Databases & Cloud", "AI & Systems Engineering") or create a logical new category.

CURRENT LIVE PORTFOLIO STATE (JSON):
${JSON.stringify(portfolio, null, 2)}

OUTPUT FORMAT:
You MUST respond with a single, valid JSON object strictly matching this schema:
{
  "summary": "Clear, concise 1-2 sentence overview of what was updated or added.",
  "actions": [
    // Array of actions to perform. Valid actions:
    // 1. ADD_PROJECT: { "type": "ADD_PROJECT", "payload": { "title": string, "description": string, "impact": string, "tech": string[], "details": string[], "status": string, "github": string, "link": string } }
    // 2. UPDATE_PROJECT: { "type": "UPDATE_PROJECT", "payload": { "id": string (id or exact title), "updates": { ...partial ProjectItem fields } } }
    // 3. DELETE_PROJECT: { "type": "DELETE_PROJECT", "payload": { "id": string } }
    // 4. UPDATE_PROFILE: { "type": "UPDATE_PROFILE", "payload": { ...partial ProfileData fields: name, title, headline, bio, location, email, github, linkedin, quote, core_focus, philosophy } }
    // 5. ADD_SKILL: { "type": "ADD_SKILL", "payload": { "category": string, "skills": string[] } }
    // 6. REMOVE_SKILL: { "type": "REMOVE_SKILL", "payload": { "category": string, "skill": string } }
    // 7. ADD_EXPERIMENT: { "type": "ADD_EXPERIMENT", "payload": { "tag": string (e.g. EXP_04), "title": string, "problem": string, "approach": string, "result": string } }
    // 8. UPDATE_EXPERIMENT: { "type": "UPDATE_EXPERIMENT", "payload": { "id": string, "updates": { ... } } }
    // 9. DELETE_EXPERIMENT: { "type": "DELETE_EXPERIMENT", "payload": { "id": string } }
  ],
  "suggestions": [
    "Optional 1-2 relevant follow-up suggestions or recommendations for Arsh's portfolio"
  ]
}

CRITICAL RULES:
1. Always output ONLY the raw JSON object. Do not wrap in markdown or prose outside the JSON.
2. If the user mentions adding a project without all links, provide sensible defaults (e.g., github: 'https://github.com/Arsh-pixel-cmd/...', status: 'Production-ready').
3. If the user asks to update experience or bio, draft crisp, professional copy that integrates seamlessly with existing profile text.
4. If multiple changes are requested (e.g., add a project AND add skills AND update bio), generate ALL corresponding actions in the "actions" array.`;
  }

  async processPrompt(userPrompt: string, currentPortfolio: PortfolioData): Promise<AiResponsePayload> {
    const config = this.getConfig();

    if (!config.apiKey || !config.apiKey.trim()) {
      throw new Error(
        `API Key for ${config.provider.toUpperCase()} is missing. Please enter your API Key in the settings.`
      );
    }

    const systemPrompt = this.buildSystemPrompt(currentPortfolio);

    let rawJsonText = '';

    if (config.provider === 'gemini') {
      rawJsonText = await this.callGemini(config.apiKey, config.model || 'gemini-1.5-flash', systemPrompt, userPrompt);
    } else if (config.provider === 'groq') {
      rawJsonText = await this.callGroq(config.apiKey, config.model || 'llama-3.3-70b-versatile', systemPrompt, userPrompt);
    } else if (config.provider === 'openai') {
      rawJsonText = await this.callOpenAi(config.apiKey, config.model || 'gpt-4o-mini', systemPrompt, userPrompt);
    } else {
      throw new Error(`Unsupported AI provider: ${config.provider}`);
    }

    return this.parseAndValidateResponse(rawJsonText);
  }

  private async callGemini(apiKey: string, model: string, systemPrompt: string, userPrompt: string): Promise<string> {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `${systemPrompt}\n\nUSER COMMAND TO EXECUTE ON PORTFOLIO:\n"${userPrompt}"`,
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      const errMsg = errorData?.error?.message || `HTTP ${res.status} ${res.statusText}`;
      throw new Error(`Gemini API Error: ${errMsg}`);
    }

    const data = await res.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      throw new Error('Gemini returned an empty response.');
    }
    return candidateText;
  }

  private async callGroq(apiKey: string, model: string, systemPrompt: string, userPrompt: string): Promise<string> {
    const endpoint = 'https://api.groq.com/openai/v1/chat/completions';

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.2,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      const errMsg = errorData?.error?.message || `HTTP ${res.status} ${res.statusText}`;
      throw new Error(`Groq API Error: ${errMsg}`);
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('Groq returned an empty response.');
    }
    return content;
  }

  private async callOpenAi(apiKey: string, model: string, systemPrompt: string, userPrompt: string): Promise<string> {
    const endpoint = 'https://api.openai.com/v1/chat/completions';

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.2,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      const errMsg = errorData?.error?.message || `HTTP ${res.status} ${res.statusText}`;
      throw new Error(`OpenAI API Error: ${errMsg}`);
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('OpenAI returned an empty response.');
    }
    return content;
  }

  private parseAndValidateResponse(rawText: string): AiResponsePayload {
    let cleaned = rawText.trim();
    // Remove markdown code fences if model included them
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    const parsed = JSON.parse(cleaned);
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('AI response is not a valid JSON object.');
    }

    const summary = typeof parsed.summary === 'string' ? parsed.summary : 'AI processed portfolio updates.';
    const actions: PortfolioAiAction[] = Array.isArray(parsed.actions) ? parsed.actions : [];
    const suggestions: string[] = Array.isArray(parsed.suggestions) ? parsed.suggestions : [];

    return {
      summary,
      actions,
      suggestions,
    };
  }

  applyActions(actions: PortfolioAiAction[]) {
    return portfolioStore.applyAiActions(actions);
  }
}

export const portfolioAiService = new PortfolioAiService();
