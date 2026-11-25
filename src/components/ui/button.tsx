import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "coral" | "outline" | "ghost" | "danger" | "white";
  size?: "sm" | "md" | "lg";
  pill?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", pill = false, children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7c5cbf]/40 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

    const variantStyles = {
      primary:
        "bg-[#7c5cbf] text-white hover:bg-[#6a4da8] shadow-sm hover:shadow-md hover:-translate-y-0.5",
      secondary:
        "bg-[#17b891] text-white hover:bg-[#139977] shadow-sm hover:shadow-md hover:-translate-y-0.5",
      coral:
        "bg-[#e8455a] text-white hover:bg-[#cf384c] shadow-sm hover:shadow-md hover:-translate-y-0.5",
      outline:
        "border border-[#7c5cbf]/20 bg-white text-[#1a1035] hover:border-[#7c5cbf] hover:text-[#7c5cbf] hover:bg-[#ede8f8]/30",
      ghost:
        "text-[#7a6e96] hover:text-[#1a1035] hover:bg-[#ede8f8]/50",
      danger:
        "bg-[#e8455a] text-white hover:bg-[#cf384c]",
      white:
        "bg-white text-[#7c5cbf] hover:bg-slate-50 shadow-md hover:shadow-lg hover:-translate-y-0.5",
    };

    const sizeStyles = {
      sm: "h-9 px-3.5 text-xs gap-1.5",
      md: "h-11 px-5 text-sm gap-2",
      lg: "h-13 px-7 text-base font-extrabold gap-2.5",
    };

    const radius = pill ? "rounded-full" : "rounded-xl";

    return (
      <button
        ref={ref}
        className={cn(baseStyles, radius, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
