import type { InputHTMLAttributes, ReactNode } from "react";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: ReactNode;
  error?: string;
}

/**
 * Field from the design: 56px tall, 10px radius, 1px #CBD5E0 border,
 * #F9FAFB fill, label notched over the top border, leading icon in #718096.
 */
export function TextField({ label, icon, error, id, ...props }: TextFieldProps) {
  return (
    <div>
      <div className="relative">
        <label
          htmlFor={id}
          className="absolute -top-2 left-3 z-10 bg-white px-1 text-xs leading-4 text-[#718096]"
        >
          {label}
        </label>
        <div
          className={`flex h-14 items-center gap-3 rounded-xl border bg-[#f9fafb] px-4 text-[#718096] transition-colors focus-within:border-primary-500 ${
            error ? "border-[#af2622]" : "border-[#cbd5e0]"
          }`}
        >
          {icon}
          <input
            id={id}
            className="w-full bg-transparent text-base text-secondary-900 outline-none placeholder:text-[#718096]"
            aria-invalid={Boolean(error)}
            {...props}
          />
        </div>
      </div>
      {error ? <p className="mt-1 text-[13px] text-[#af2622]">{error}</p> : null}
    </div>
  );
}
