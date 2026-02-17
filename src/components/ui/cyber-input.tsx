import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const CyberInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, ...props }, ref) => {
    return (
      <div className="space-y-1 w-full">
        {label && (
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">
            {label}
          </label>
        )}
        <div className="relative group">
          <input
            type={type}
            className={cn(
              "flex h-10 w-full rounded-sm border border-input bg-black/20 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 font-mono",
              "hover:border-primary/50",
              error && "border-destructive focus-visible:ring-destructive",
              className
            )}
            ref={ref}
            {...props}
          />
          <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-primary transition-all duration-300 group-hover:w-full group-focus-within:w-full opacity-50" />
        </div>
        {error && (
          <p className="text-[10px] text-destructive font-mono uppercase tracking-tight">{error}</p>
        )}
      </div>
    )
  }
)
CyberInput.displayName = "CyberInput"

export { CyberInput }
