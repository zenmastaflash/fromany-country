import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <input
        className={`
  w-full rounded-md border-border bg-text text-background px-3 py-2 
  placeholder-secondary
  focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
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
