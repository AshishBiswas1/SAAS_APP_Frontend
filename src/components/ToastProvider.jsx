import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect
} from 'react';
import { setToastHandler } from './toastService';

const ToastContext = createContext(null);

export function useToast() {
  return useContext(ToastContext);
}

let idCounter = 1;

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const show = useCallback((message, type = 'info', opts = {}) => {
    const id = idCounter++;
    const toast = { id, message, type, ...opts };
    setToasts((t) => [...t, toast]);
    if (!opts.sticky) {
      setTimeout(() => {
        setToasts((t) => t.filter((x) => x.id !== id));
      }, opts.duration || 4000);
    }
    return id;
  }, []);

  const remove = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ show, remove }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`max-w-sm w-full px-4 py-3 rounded shadow-lg border ${
              t.type === 'error'
                ? 'bg-rose-600/95 border-rose-700 text-white'
                : t.type === 'success'
                ? 'bg-emerald-600/95 border-emerald-700 text-white'
                : 'bg-slate-800/95 border-slate-700 text-white'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="text-sm leading-snug">{t.message}</div>
              <button
                onClick={() => remove(t.id)}
                className="ml-2 text-xs opacity-80"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
      <ToastEventBridge />
    </ToastContext.Provider>
  );
}

// Wire the imperative toastService so non-React code can call toasts
// register handler
setToastHandler((message, type = 'info', opts = {}) => {
  // We cannot call hooks here; instead call the context provider's show
  // by creating a temporary element and dispatching a custom event.
  // Simpler: call window.dispatchEvent with detail and let provider listen.
  window.dispatchEvent(
    new CustomEvent('site-toast', { detail: { message, type, opts } })
  );
});

// Also listen to these events inside the provider and call show
// We'll add the listener inside the provider via a small component.
export function ToastEventBridge() {
  const { show } = useToast();
  useEffect(() => {
    const handler = (e) => {
      const { message, type, opts } = e.detail || {};
      if (message) show(message, type, opts);
    };
    window.addEventListener('site-toast', handler);
    return () => window.removeEventListener('site-toast', handler);
  }, [show]);
  return null;
}
