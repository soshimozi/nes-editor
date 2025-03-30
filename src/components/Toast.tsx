'use client';
import React, { useEffect, useState } from 'react';

type ToastProps = {
    show: boolean;
    duration?: number;
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    children: React.ReactNode;
  };
  
  export const Toast: React.FC<ToastProps> = ({
    show,
    duration = 2000,
    position = 'bottom-right',
    children
  }) => {
    const [visible, setVisible] = useState(false);
    const [trigger, setTrigger] = useState(0);
  
    useEffect(() => {
      if (show) {
        setTrigger((prev) => prev + 1);
      }
    }, [show]);
  
    useEffect(() => {
      if (trigger === 0) return;
      setVisible(true);
      const timeout = setTimeout(() => setVisible(false), duration);
      return () => clearTimeout(timeout);
    }, [trigger, duration]);
  
    if (!visible) return null;
  
    const positionClasses: Record<NonNullable<ToastProps['position']>, string> = {
      'bottom-right': 'bottom-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'top-right': 'top-4 right-4',
      'top-left': 'top-4 left-4',
    };
  
    return (
      <div
        className={`fixed z-50 px-4 py-2 rounded bg-zinc-800 text-white shadow-md text-sm ${positionClasses[position]}`}
      >
        {children}
      </div>
    );
  };
  