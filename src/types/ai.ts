// src/types/ai.ts
import { ProjectItem, ProfileData, ExperimentItem } from './portfolio';

export type AiProvider = 'gemini' | 'groq' | 'openai';

export interface AiConfig {
  provider: AiProvider;
  apiKey: string;
  model: string;
  autoApply: boolean;
  autoSyncDb?: boolean;
}

export type PortfolioAiAction =
  | {
      type: 'ADD_PROJECT';
      payload: Omit<ProjectItem, 'id'> & { id?: string };
    }
  | {
      type: 'UPDATE_PROJECT';
      payload: {
        id: string;
        updates: Partial<ProjectItem>;
      };
    }
  | {
      type: 'DELETE_PROJECT';
      payload: {
        id: string;
      };
    }
  | {
      type: 'UPDATE_PROFILE';
      payload: Partial<ProfileData>;
    }
  | {
      type: 'ADD_SKILL';
      payload: {
        category: string;
        skills: string[];
      };
    }
  | {
      type: 'REMOVE_SKILL';
      payload: {
        category: string;
        skill: string;
      };
    }
  | {
      type: 'ADD_EXPERIMENT';
      payload: Omit<ExperimentItem, 'id'> & { id?: string };
    }
  | {
      type: 'UPDATE_EXPERIMENT';
      payload: {
        id: string;
        updates: Partial<ExperimentItem>;
      };
    }
  | {
      type: 'DELETE_EXPERIMENT';
      payload: {
        id: string;
      };
    };

export interface AiResponsePayload {
  summary: string;
  actions: PortfolioAiAction[];
  suggestions?: string[];
}

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  timestamp: number;
  text: string;
  responsePayload?: AiResponsePayload;
  applied?: boolean;
  error?: string;
  suggestions?: string[];
}
