import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

type PanelProps = {
  title: string;
  children: React.ReactNode;
  help?: React.ReactNode;
};

export const Panel: React.FC<PanelProps> = ({ title, children, help }) => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <div className="bg-gray-200 rounded shadow-md p-4 border border-zinc-300 space-y-3">
      <div className="flex justify-between items-center border-b pb-1">
        <h2 className="text-lg font-semibold">{title}</h2>

        {help && (
          <button
            onClick={() => setIsHelpOpen(!isHelpOpen)}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800"
          >
            {isHelpOpen ? <ChevronDown size={16} className="mr-1" /> : <ChevronRight size={16} className="mr-1" />}
            Help
          </button>
        )}
      </div>

      {children}

      {help && isHelpOpen && (
        <div className="mt-2 p-3 bg-zinc-100 border border-zinc-300 rounded text-sm text-zinc-700 animate-fade-in">
          {help}
        </div>
      )}
    </div>
  );
};
