import type { InputHTMLAttributes, ReactNode } from "react";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: ReactNode;
}

/** Input styled after the design system: inner label, leading icon. */
export function TextField({ label, icon, id, ...props }: TextFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="flex w-full flex-col gap-1 rounded-xl border border-secondary-200 bg-white px-4 py-2 transition-colors focus-within:border-primary-500"
      >
        <span className="text-xs text-secondary-400">{label}</span>
        <span className="flex items-center gap-3 text-secondary-400">
          {icon}
          <input
            id={id}
            className="w-full bg-transparent text-base text-secondary-900 outline-none placeholder:text-secondary-400"
            {...props}
          />
        </span>
      </label>
    </div>
  );
}
