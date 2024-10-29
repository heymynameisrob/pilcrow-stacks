import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    icon?: React.ReactNode;
  }
>(({ className, icon, type, ...props }, ref) => {
  if (icon) {
    return (
      <div className="relative">
        {icon && (
          <div className="absolute top-0 bottom-0 left-0 w-10 flex items-center justify-center">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-gray-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-7 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            "pl-10",
            className,
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }

  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-gray-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-7 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
