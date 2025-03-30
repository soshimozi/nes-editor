'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, ChevronUp } from 'lucide-react';

type CollapsiblePanelProps = {
  title: string;
  children: React.ReactNode;
  help?: React.ReactNode;
};

export const CollapsiblePanel: React.FC<CollapsiblePanelProps> = ({ title, children, help}) => {
  const [expanded, setExpanded] = useState(true);
  

  return (
    <div className="bg-gray-200 rounded shadow-md p-4 border border-zinc-300 space-y-3">

                <div className="flex justify-between items-center border-b pb-1">
                    <div className="flex items-center space-x-2">
                        <h2 className="text-lg font-semibold">
                            {title}
                        </h2>
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                        >
                            {expanded ? <ChevronUp size={16} className="mr-1" /> : <ChevronDown size={16} className="mr-1" />}
                        </button>
                    </div>
                </div>
                {expanded && (
                <div className="animation-fade-in">                
                
                    {children}

                    {help && (
                        <div className="mt-2 p-3 bg-zinc-100 border border-zinc-300 rounded text-sm text-zinc-700 animate-fade-in">
                        {help}
                        </div>
                    )}
                </div>
            )}
    </div>
  );
};
