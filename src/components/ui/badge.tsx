import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "coral" | "warning" | "neutral" | "success";
}

export function Badge({
  className,
  variant = "neutral",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    primary: "bg-[#ede8f8] text-[#7c5cbf] border-[#7c5cbf]/20",
    secondary: "bg-[#d0f5ee] text-[#17b891] border-[#17b891]/20",
    coral: "bg-[#fde8eb] text-[#e8455a] border-[#e8455a]/20",
    success: "bg-[#d0f5ee] text-[#17b891] border-[#17b891]/20",
    warning: "bg-[#fef3c7] text-[#d97706] border-[#f59e0b]/20",
    neutral: "bg-[#f8f7fc] text-[#7a6e96] border-[#7c5cbf]/10",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-bold transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
