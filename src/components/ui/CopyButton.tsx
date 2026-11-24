import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import Button from "./Button";

type CopyButtonProps = {
  text: string;
  label?: string;
  disabled?: boolean;
};

function CopyButton({ text, label = "Copy", disabled = false }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);

      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard access can be blocked; nothing useful to do about it.
    }
  }

  const Icon = copied ? Check : Copy;

  return (
    <Button
      type="button"
      variant="ghost"
      disabled={disabled || !text}
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 px-3 py-1 text-xs"
    >
      <Icon size={13} aria-hidden="true" />
      {copied ? "Copied" : label}
    </Button>
  );
}

export default CopyButton;
