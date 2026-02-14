import * as React from 'react'

import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap font-bold text-sm uppercase tracking-wide transition-all duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neo-cyan focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-[3px] border-neo-black',
  {
    variants: {
      variant: {
        default:
          'bg-neo-yellow text-neo-black shadow-neo-md hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-neo-sm',
        destructive:
          'bg-neo-pink text-neo-white shadow-neo-md hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-neo-sm',
        outline:
          'bg-neo-white text-neo-black shadow-neo-md hover:bg-neo-yellow hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-neo-sm',
        secondary:
          'bg-neo-gray text-neo-black shadow-neo-md hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-neo-sm',
        ghost:
          'bg-transparent border-transparent shadow-none hover:bg-neo-yellow hover:border-neo-black',
        link: 'bg-transparent border-none shadow-none underline underline-offset-4 hover:bg-neo-cyan',
      },
      size: {
        default: 'h-10 px-6 py-3',
        sm: 'h-9 px-4 py-2 text-xs',
        lg: 'h-11 px-8 py-3 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
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
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
