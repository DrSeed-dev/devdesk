import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Button from "../components/ui/Button";

type ToastState = {
  id: number;
  message: string;
  onUndo: () => void;
} | null;

type ToastContextValue = {
  showUndoToast: (message: string, onUndo: () => void) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);
const AUTO_DISMISS_MS = 5000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState>(null);
  const timeoutRef = useRef<number | null>(null);
  const nextId = useRef(0);

  const dismiss = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setToast(null);
  }, []);

  const showUndoToast = useCallback((message: string, onUndo: () => void) => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }

    const id = ++nextId.current;
    setToast({ id, message, onUndo });

    timeoutRef.current = window.setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
      timeoutRef.current = null;
    }, AUTO_DISMISS_MS);
  }, []);

  function handleUndo() {
    toast?.onUndo();
    dismiss();
  }

  return (
    <ToastContext.Provider value={{ showUndoToast }}>
      {children}

      {toast ? (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-x-0 bottom-4 z-[60] flex justify-center px-4"
        >
          <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 shadow-2xl">
            <span>{toast.message}</span>
            <Button
              type="button"
              className="px-3 py-1 text-xs"
              onClick={handleUndo}
            >
              Undo
            </Button>
          </div>
        </div>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
}
