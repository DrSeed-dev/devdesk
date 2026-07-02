import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "danger";
};

const baseStyles =
  "rounded-xl px-4 py-2 text-sm font-semibold transition active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100";

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-sky-600 text-white shadow-sm hover:bg-sky-700 focus:ring-sky-500",
  danger: "text-rose-600 hover:text-rose-700 focus:ring-rose-400",
};

function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    />
  );
}

export default Button;
