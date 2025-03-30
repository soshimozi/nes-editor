

'use client';

import React from 'react';

import { Tile } from '@/core/chr';
import { ChrTileCanvas } from './ChrTileCanvas';


export type Tool = 'draw' | 'erase' | 'fill';

type ToolSelectorProps = {
    selectedTool: Tool
    onSelect?: (tool: Tool) => void;
};


export const ToolSelector: React.FC<ToolSelectorProps> = ({ selectedTool, onSelect }) => {

    return (
        <div className="flex space-x-2">
            {['draw', 'erase', 'fill'].map((mode) => (
                <button
                    key={mode}
                    onClick={() => onSelect?.(mode as Tool) }
                    className={`px-3 py-1 rounded text-sm font-mono capitalize transition
                        ${selectedTool === mode
                        ? 'bg-blue-600 text-white'
                        : 'bg-zinc-200 text-zinc-800 hover:bg-zinc-300'}
                    `}                        
                >
                    {mode}
                </button>
            ))}
        </div> 
    )
};