import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-sm text-sm font-medium ring-offset-background transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform-gpu cursor-pointer hover:scale-105 hover:-translate-y-0.5 active:scale-95 active:translate-y-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-lg hover:shadow-destructive/25",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:shadow-md hover:border-accent-foreground/20",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-lg hover:shadow-secondary/25",
        ghost: "hover:bg-accent hover:text-accent-foreground hover:shadow-sm",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80",
        navbar: "bg-transparent text-gray-700 hover:text-lime-600 hover:bg-lime-50 px-4 py-2 rounded-sm hover:scale-105 hover:shadow-md active:scale-95 hover:border-lime-200",
        primary: "bg-lime-600 text-white hover:bg-lime-500 px-6 py-2 rounded-sm font-semibold shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 active:scale-95 active:translate-y-0 hover:shadow-lime-500/30",
        secondaryBtn: "bg-gray-200 text-gray-700 hover:bg-gray-300 px-6 py-2 rounded-sm font-semibold shadow-md hover:shadow-lg hover:scale-105 hover:-translate-y-1 active:scale-95 active:translate-y-0 hover:shadow-gray-400/30",
        philippines: "bg-lime-600 text-white hover:bg-lime-500 px-6 py-3 rounded-sm font-bold text-sm shadow-lg hover:shadow-xl hover:scale-105 hover:-translate-y-1 active:scale-95 active:translate-y-0 hover:shadow-lime-500/30",
        // New enhanced variants for employee page
        employeePrimary: "bg-lime-600 text-white hover:bg-lime-500 px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-xl hover:shadow-lime-500/25 hover:scale-105 hover:-translate-y-1 active:scale-95 active:translate-y-0 border border-lime-600 hover:border-lime-500",
        employeeSecondary: "bg-white text-lime-600 border border-lime-600 hover:bg-lime-50 hover:border-lime-500 px-4 py-2 rounded-lg font-medium shadow-sm hover:shadow-md hover:shadow-lime-500/15 hover:scale-105 hover:-translate-y-1 active:scale-95 active:translate-y-0",
        employeeOutline: "bg-transparent text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900 px-4 py-2 rounded-lg font-medium shadow-sm hover:shadow-md hover:shadow-gray-400/15 hover:scale-105 hover:-translate-y-1 active:scale-95 active:translate-y-0",
        employeeGhost: "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900 px-2 py-1 rounded-md font-medium hover:scale-105 active:scale-95",
        refresh: "bg-lime-600 text-white hover:bg-lime-500 px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-xl hover:shadow-lime-500/25 hover:scale-105 hover:-translate-y-1 active:scale-95 active:translate-y-0 border border-lime-600 hover:border-lime-500 [&>svg]:hover:animate-spin",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-sm px-3",
        lg: "h-11 rounded-sm px-8",
        icon: "h-10 w-10",
        xs: "h-7 px-2 py-1 text-xs",
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
