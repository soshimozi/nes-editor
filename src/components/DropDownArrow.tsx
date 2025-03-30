import React from 'react';

type Direction = 'up' | 'down';

interface DropdownArrowProps {
  direction?: Direction;
  size?: number; // optional, defaults to 4
  className?: string;
}

export const DropdownArrow: React.FC<DropdownArrowProps> = ({
  direction = 'down',
  size = 4,
  className = '',
}) => {
  const rotation = direction === 'up' ? 'rotate-180' : '';

  return (
    <svg
      className={`ml-2 w-${size} h-${size} ${rotation} ${className}`}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M5.25 7.5L10 12.25L14.75 7.5H5.25Z" />
    </svg>
  );
};