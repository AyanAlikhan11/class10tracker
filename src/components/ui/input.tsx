import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, hint, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[#243247] select-none"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          ref={ref}
          className={cn(
            "flex h-11 w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2 text-base text-[#243247] placeholder:text-[#94A3B8] transition-colors focus:border-[#3978E8] focus:outline-none focus:ring-2 focus:ring-[#3978E8]/20 disabled:cursor-not-allowed disabled:bg-[#F8FAFC]",
            error && "border-[#E53E3E] focus:border-[#E53E3E] focus:ring-[#E53E3E]/20",
            className
          )}
          {...props}
        />
        {hint && !error && <span className="text-xs text-[#718096]">{hint}</span>}
        {error && <span className="text-xs font-medium text-[#E53E3E]">{error}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";
