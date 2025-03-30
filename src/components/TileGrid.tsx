'use client';

import React from 'react';

import { Tile } from '@/core/chr';
import { ChrTileCanvas } from './ChrTileCanvas';
import DraggableItem from './DraggableItem';

type TileGridProps = {
    tiles: Tile[];
    // selectedIndex: number;
    // onSelect?: (index: number) => void;
    scale?: number;
    palette: [string, string, string, string]; // 👈 Add this
};

export const TileGrid: React.FC<TileGridProps> = ({
    tiles,
    // selectedIndex,
    // onSelect,
    scale = 2,
    palette
}) => {

    const cellSize = 8;

    return (
        <div className="inline-block p-1">
            <div
                className="grid gap-2"
                style={{
                    gridTemplateColumns: `repeat(4, ${cellSize * scale * 2}px`,
                }}
                >
                    {tiles.map((tile, index) => (
                    <div key={index} className="flex items-end space-x-1">
                        <span className="text-sm font-sans font-light text-black justify-items-start mb-1">
                            {index.toString().padStart(3, '0')}
                        </span>
                        <div className="justify-items-end w-full">
                            <DraggableItem id={index.toString().padStart(3, '0')}>
                            <ChrTileCanvas
                                tile={tile}
                                // isSelected={index === selectedIndex}
                                isSelectable={false}
                                scale={scale}
                                palette={palette}
                            />
                            </DraggableItem>
                        </div>
                    </div>                        
                    ))}
            </div>
        </div>
    );
};