// src/core/authStore.ts
import { UserSession } from '../types/portfolio';
import { cloudflareApi } from '../services/cloudflareApi';
import { systemBus } from './eventBus';

const SESSION_KEY = 'xp_current_session';

export interface AuthState {
  session: UserSession | null;
  isLocked: boolean; // whether Welcome / Login screen is showing
  error: string | null;
  isLoading: boolean;
}

const listeners = new Set<(state: AuthState) => void>();

let currentAuthState: AuthState = {
  session: loadInitialSession(),
  isLocked: !hasInitialSession(), // Start locked on boot if desired, or unlocked as guest
  error: null,
  isLoading: false,
};

function hasInitialSession(): boolean {
  return Boolean(localStorage.getItem(SESSION_KEY));
}

function loadInitialSession(): UserSession | null {
  try {
    const saved = localStorage.getItem(SESSION_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // fallback
  }
  return null;
}

function emitChange() {
  listeners.forEach(fn => fn(currentAuthState));
}

export const authStore = {
  getState: () => currentAuthState,
  subscribe: (fn: (state: AuthState) => void) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },

  loginAsGuest: () => {
    const session: UserSession = {
      username: 'Guest',
      role: 'guest',
      loginTime: Date.now(),
    };
    currentAuthState = {
      ...currentAuthState,
      session,
      isLocked: false,
      error: null,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    systemBus.emit({
      type: 'SYS_LOG',
      payload: {
        id: `auth-${Date.now()}`,
        timestamp: Date.now(),
        level: 'INFO',
        message: 'Logged on as Guest',
      },
    });
    emitChange();
  },

  loginAsAdmin: async (password: string): Promise<boolean> => {
    currentAuthState = { ...currentAuthState, isLoading: true, error: null };
    emitChange();

    const result = await cloudflareApi.login(password);
    if (!result.success) {
      currentAuthState = {
        ...currentAuthState,
        isLoading: false,
        error: result.error || 'The system could not log you on. Please check your password.',
      };
      emitChange();
      return false;
    }

    const session: UserSession = {
      username: 'Arsh',
      role: 'admin',
      token: result.token,
      loginTime: Date.now(),
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    currentAuthState = {
      ...currentAuthState,
      session,
      isLocked: false,
      isLoading: false,
      error: null,
    };

    systemBus.emit({
      type: 'SYS_LOG',
      payload: {
        id: `auth-${Date.now()}`,
        timestamp: Date.now(),
        level: 'INFO',
        message: 'Security subsystem: Administrator Arsh logged on with full privileges',
      },
    });

    emitChange();
    return true;
  },

  logOff: () => {
    cloudflareApi.setToken('');
    localStorage.removeItem(SESSION_KEY);
    currentAuthState = {
      session: null,
      isLocked: true,
      error: null,
      isLoading: false,
    };
    systemBus.emit({
      type: 'SYS_LOG',
      payload: {
        id: `auth-${Date.now()}`,
        timestamp: Date.now(),
        level: 'INFO',
        message: 'User logged off. Returning to logon screen.',
      },
    });
    emitChange();
  },

  lockWorkstation: () => {
    currentAuthState = {
      ...currentAuthState,
      isLocked: true,
      error: null,
    };
    emitChange();
  },

  unlock: () => {
    if (currentAuthState.session) {
      currentAuthState = { ...currentAuthState, isLocked: false };
      emitChange();
    }
  },

  changeLocalAdminPassword: (newPass: string) => {
    localStorage.setItem('xp_local_admin_pass', newPass);
  },
};
