import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform-gpu",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        navbar: "bg-transparent text-gray-700 hover:text-lime-600 hover:bg-lime-50 px-4 py-2 rounded-lg hover:scale-105 hover:shadow-md active:scale-95",
        primary: "bg-gradient-to-r from-lime-600 via-lime-400 to-lime-600 text-white hover:bg-gradient-to-r hover:from-lime-400 hover:via-lime-600 hover:to-lime-400 px-6 py-2 rounded-lg font-semibold shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 active:scale-95 active:translate-y-0 bg-[length:200%_100%] bg-[position:center_center] hover:bg-[length:200%_100%] hover:bg-[position:left_center]",
        secondaryBtn: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 px-6 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg hover:scale-105 hover:-translate-y-1 active:scale-95 active:translate-y-0",
        philippines: "bg-gradient-to-r from-orange-400 via-orange-500 to-purple-600 text-white hover:from-orange-500 hover:via-orange-600 hover:to-purple-700 px-6 py-3 rounded-full font-bold text-sm shadow-lg hover:shadow-xl hover:scale-105 hover:-translate-y-1 active:scale-95 active:translate-y-0",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
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
