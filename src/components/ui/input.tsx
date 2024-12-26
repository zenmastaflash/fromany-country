import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <input
        className={`
          w-full rounded-md border border-fac-primary bg-fac-background px-3 py-2 
          text-fac-text placeholder-fac-light
          focus:outline-none focus:ring-2 focus:ring-fac-primary
          disabled:opacity-50
          ${className}
        `}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
