import { HTMLAttributes } from 'react';
import { getTextColor } from '@/utils/colorUtils';

interface DynamicTextProps extends HTMLAttributes<HTMLDivElement> {
  backgroundColor: string;
}

export function DynamicText({ backgroundColor, className = '', children, ...props }: DynamicTextProps) {
  const textColor = getTextColor(backgroundColor);

  return (
    <div
      className={className}
      style={{ color: textColor }}
      {...props}
    >
      {children}
    </div>
  );
}
