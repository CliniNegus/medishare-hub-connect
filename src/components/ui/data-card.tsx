
import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cva, type VariantProps } from "class-variance-authority";

const dataCardVariants = cva("transition-all duration-300", {
  variants: {
    variant: {
      default: "bg-card",
      primary: "bg-primary/10",
      success: "bg-green-50",
      warning: "bg-yellow-50",
      danger: "bg-red-50",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface DataCardProps extends VariantProps<typeof dataCardVariants> {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  footer?: React.ReactNode;
}

export function DataCard({
  title,
  value,
  icon,
  trend,
  variant,
  className,
  footer,
}: DataCardProps) {
  return (
    <Card className={cn(dataCardVariants({ variant }), "overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <div className="mt-1 flex items-center text-xs">
            <span
              className={cn("flex items-center", {
                "text-green-600": trend.isPositive,
                "text-red-600": !trend.isPositive,
              })}
            >
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </span>
            <span className="ml-1 text-muted-foreground">from last period</span>
          </div>
        )}
        {footer && <div className="mt-4 pt-4 border-t text-sm">{footer}</div>}
      </CardContent>
    </Card>
  );
}
