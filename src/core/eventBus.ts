// src/core/eventBus.ts
import { SystemEvent } from './types';

type Listener = (event: SystemEvent) => void;

class EventBus {
  private listeners: Listener[] = [];

  subscribe(fn: Listener) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  emit(event: SystemEvent) {
    this.listeners.forEach(fn => fn(event));
  }
}

export const systemBus = new EventBus();
