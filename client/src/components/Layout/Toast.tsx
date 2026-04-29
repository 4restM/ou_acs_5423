import { useEffect } from 'react';

export interface ToastMessage {
  id: number;
  title: string;
  items: string[];
  type: 'error' | 'warning' | 'success';
}

interface Props {
  toasts: ToastMessage[];
  onDismiss: (id: number) => void;
}

const Toast = ({ toasts, onDismiss }: Props) => {
  return (
    <div className="toast-container" aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem = ({
  toast,
  onDismiss,
}: {
  toast: ToastMessage;
  onDismiss: (id: number) => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 5000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div className={`toast toast-${toast.type}`} role="alert">
      <div className="toast-header">
        <strong className="toast-title">{toast.title}</strong>
        <button
          className="toast-close"
          onClick={() => onDismiss(toast.id)}
          aria-label="Dismiss"
        >
          &times;
        </button>
      </div>
      {toast.items.length > 0 && (
        <ul className="toast-list">
          {toast.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Toast;
