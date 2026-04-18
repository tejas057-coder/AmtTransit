import { useState, useCallback } from 'react';

interface ToastProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const toast = useCallback(({ title, description, variant }: ToastProps) => {
    console.log(`[Toast] ${variant === 'destructive' ? '❌' : '✅'} ${title}: ${description}`);
    // In a real app, this would trigger a UI component.
    // For now, let's keep it simple.
  }, []);

  return { toast };
}
