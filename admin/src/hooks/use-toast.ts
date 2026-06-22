import { useState, useEffect, useCallback } from 'react';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'success' | 'destructive' | 'warning';
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  toast: (toast: Omit<Toast, 'id'>) => void;
  dismiss: (id: string) => void;
}

let globalToasts: Toast[] = [];
let listeners: Array<(toasts: Toast[]) => void> = [];

const notifyListeners = () => {
  listeners.forEach(listener => listener([...globalToasts]));
};

export const useToast = (): ToastContextType => {
  const [toasts, setToasts] = useState<Toast[]>(globalToasts);

  useEffect(() => {
    listeners.push(setToasts);
    return () => {
      listeners = listeners.filter(l => l !== setToasts);
    };
  }, []);

  const toast = useCallback(({ title, description, variant = 'default', duration = 4000 }: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { id, title, description, variant, duration };
    
    globalToasts = [...globalToasts, newToast];
    notifyListeners();

    if (duration !== Infinity) {
      setTimeout(() => {
        globalToasts = globalToasts.filter(t => t.id !== id);
        notifyListeners();
      }, duration);
    }
  }, []);

  const dismiss = useCallback((id: string) => {
    globalToasts = globalToasts.filter(t => t.id !== id);
    notifyListeners();
  }, []);

  return { toasts, toast, dismiss };
};
