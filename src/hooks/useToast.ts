import { createContext, useContext } from "react";

export type ToastContextValue = {
  showUndoToast: (message: string, onUndo: () => void) => void;
};

export const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
}