import { ButtonHTMLAttributes, forwardRef } from 'react';
import { buttonVariants } from './variants';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', children, ...props }, ref) => {
    return (
      <button
        className={`
          inline-flex items-center justify-center rounded-md px-4 py-2 
          text-sm font-medium focus:outline-none focus:ring-2 
          focus:ring-offset-2 disabled:opacity-50 
          ${buttonVariants[variant]} 
          ${className}
        `}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
