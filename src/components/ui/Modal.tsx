import { useEffect } from "react";
import type { ReactNode } from "react";
import { X } from "lucide-react";
import Button from "./Button";

type ModalProps = {
  title: string;
  onClose: () => void;
  children: ReactNode;
};

function Modal({ title, onClose, children }: ModalProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 flex max-h-[85vh] w-full max-w-lg flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <h2 className="text-base font-semibold text-slate-950 dark:text-slate-100">
            {title}
          </h2>

          <Button
            type="button"
            variant="ghost"
            className="px-2 py-1"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={16} />
          </Button>
        </div>

        <div className="thin-scrollbar overflow-y-auto px-5 py-4">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
