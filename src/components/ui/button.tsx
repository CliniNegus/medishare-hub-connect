
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 font-semibold",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 font-semibold",
        outline:
          "border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground dark:border-border dark:hover:bg-accent",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-gray-300 dark:border-border",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // New button variants for CliniBuilds with dark mode support
        'primary-red': "bg-[#E02020] text-white hover:bg-[#c01010] font-semibold dark:bg-[#FF4444] dark:hover:bg-[#E02020]",
        'secondary-outlined': "bg-white border-2 border-[#E02020] text-[#333333] hover:bg-red-50 font-semibold dark:bg-background dark:border-[#FF4444] dark:text-foreground dark:hover:bg-accent",
        'dark-outlined': "bg-white border-2 border-[#333333] text-[#333333] hover:bg-gray-50 font-semibold dark:bg-background dark:border-border dark:text-foreground dark:hover:bg-accent",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-12 rounded-md px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
