

'use client';

import React from 'react';

import { Tile } from '@/core/chr';
import { ChrTileCanvas } from './ChrTileCanvas';
import { Eraser, PaintBucket, Pencil } from 'lucide-react';


export type Tool = 'draw' | 'erase' | 'fill';

type ToolSelectorProps = {
    selectedTool: Tool
    onSelect?: (tool: Tool) => void;
};

type ToolControlDefinition = {
    tool: Tool,
    content?: React.ReactElement
}

export const ToolSelector: React.FC<ToolSelectorProps> = ({ selectedTool, onSelect }) => {

    const tools: ToolControlDefinition[] = [
        {tool: "draw", content: (<Pencil size={18} strokeWidth={1} />)},
        {tool: "erase", content: (<Eraser  size={18} strokeWidth={1} />)},
        {tool: "fill", content: (<PaintBucket  size={18} strokeWidth={1} />)}
    ]
    return (
        <div className="flex space-x-2">
            {tools.map((def, i) => (
                <button
                    key={i}
                    onClick={() => onSelect?.(def.tool as Tool) }
                    className={`px-3 py-1 rounded text-sm font-mono capitalize transition
                        ${selectedTool === def.tool
                        ? 'bg-blue-600 text-white'
                        : 'bg-zinc-200 text-zinc-800 hover:bg-zinc-100'}
                    `}                        
                >
                    <div className='flex flex-row gap-1'>
                    {def.tool}
                    {def.content}
                    </div>
                </button>
            ))}
        </div> 
    )
};