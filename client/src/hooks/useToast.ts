import { useState, useCallback } from 'react';
import type { ToastMessage } from '../components/Layout/Toast';

let nextId = 0;

const useToast = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback(
    (title: string, items: string[], type: ToastMessage['type'] = 'error') => {
      const id = ++nextId;
      setToasts((prev) => [...prev, { id, title, items, type }]);
    },
    []
  );

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, showToast, dismissToast };
};

export default useToast;
