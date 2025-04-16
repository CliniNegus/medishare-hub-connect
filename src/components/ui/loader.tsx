
import React from "react";
import { cn } from "@/lib/utils";

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "primary" | "secondary";
}

export function Loader({
  size = "md",
  variant = "default",
  className,
  ...props
}: LoaderProps) {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-t-transparent",
        {
          "h-4 w-4 border-2": size === "sm",
          "h-6 w-6 border-2": size === "md",
          "h-8 w-8 border-3": size === "lg",
          "border-gray-300 border-t-transparent": variant === "default",
          "border-red-600 border-t-transparent": variant === "primary",
          "border-black border-t-transparent": variant === "secondary",
        },
        className
      )}
      {...props}
    />
  );
}

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
      <div className="text-center">
        <Loader size="lg" variant="primary" className="mx-auto" />
        <p className="mt-4 text-gray-800">Loading...</p>
      </div>
    </div>
  );
}

export function ButtonLoader({ className, variant = "secondary" }: { className?: string; variant?: "default" | "primary" | "secondary" }) {
  return <Loader size="sm" variant={variant} className={cn("mr-2", className)} />;
}
