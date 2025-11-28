import { HTMLAttributes, forwardRef } from 'react';
import './Card.css';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  clickable?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      variant = 'default',
      padding = 'md',
      clickable = false,
      className = '',
      onClick,
      ...props
    },
    ref
  ) => {
    const classNames = [
      'card',
      `card--${variant}`,
      `card--padding-${padding}`,
      clickable && 'card--clickable',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (clickable && onClick && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        onClick(e as unknown as React.MouseEvent<HTMLDivElement>);
      }
    };

    return (
      <div
        ref={ref}
        className={classNames}
        onClick={clickable ? onClick : undefined}
        onKeyDown={clickable ? handleKeyDown : undefined}
        tabIndex={clickable ? 0 : undefined}
        role={clickable ? 'button' : undefined}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
