'use client';

import React, { ReactNode, useState } from 'react';
import { TabProps } from './Tab';

type TabsProps = {
  children: React.ReactElement<TabProps>[];
};

export const Tabs: React.FC<TabsProps> = ({ children }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div>
      <div className="flex border-b">
        {children.map((child, index) => (
          <button
            key={child.props.label}
            onClick={() => setActiveIndex(index)}
            className={`px-4 py-2 -mb-px border-b-2 ${
              index === activeIndex ? 'border-blue-500 font-bold' : 'border-transparent text-gray-500'
            }`}
          >
            {child.props.label}
          </button>
        ))}
      </div>

      <div className="p-4">
        {children[activeIndex]}
      </div>
    </div>
  );
};
