'use client';
import React, { useState, useRef, useEffect } from 'react';

type MenuItem = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
};

type MenuButtonProps = {
  title: string;
  items: MenuItem[];
};

export const MenuButton: React.FC<MenuButtonProps> = ({ title, items }) => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!buttonRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={buttonRef}>
        <button
        onClick={() => setOpen(prev => !prev)}
        className="text-sm px-2 py-1 hover:bg-zinc-200 text-zinc-800 rounded-sm transition"
        >
        {title}
        </button>
        {open && (
          <div className='relative'>
              <div className="absolute left-0 mt-2 w-48 bg-white border border-zinc-300 shadow-lg rounded z-50">
              {items.map((item, i) => (
                  !item.disabled &&
                  <button
                  key={i}
                  onClick={() => {
                      item.onClick();
                      setOpen(false);
                  }}
                  disabled={item.disabled}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-zinc-100"
                  >
                  {item.label}
                  </button>
              ))}
              </div>
          </div>
        )}
    </div>
  );
};
