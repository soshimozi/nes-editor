'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Tile, getTilePixel } from '@/core/chr';

type ChrTileCanvasProps = {
    tile: Tile;
    scale?: number;
    palette?: [string, string, string, string]; // NES-style palette: 4 color hex strings
    onDrawPixel?: (x: number, y: number) => void; // callback for drawing
    isSelected: boolean;
};

export const ChrTileCanvas: React.FC<ChrTileCanvasProps> = ({
    tile,
    scale = 16,
    palette = ['#000000', '#555555', '#AAAAAA', '#FFFFFF'],
    onDrawPixel,
    isSelected
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [isDrawing, setIsDrawing] = useState(false);

    const size = 8 * scale;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const handle = requestAnimationFrame(() => {
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            ctx.clearRect(0, 0, size, size);

            for (let y = 0; y < 8; y++) {
                for (let x = 0; x < 8; x++) {
                    const colorIndex = getTilePixel(tile, x, y) & 0b11;
                    ctx.fillStyle = palette[colorIndex] ?? '#000000';
                    ctx.fillRect(x * scale, y * scale, scale, scale);
                }
            }
        });

    return () => cancelAnimationFrame(handle);

}, [tile, scale, palette]);

    const getMouseCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / scale);
        const y = Math.floor((e.clientY - rect.top) / scale);
        return { x, y };
    }

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if(!onDrawPixel) return;
        setIsDrawing(true);
        const { x, y } = getMouseCoords(e);
        onDrawPixel(x, y);
    }

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if(!isDrawing || !onDrawPixel) return;
        const { x, y } = getMouseCoords(e);
        onDrawPixel(x, y);
    }

    const handleMouseUp = () => {
        setIsDrawing(false);
    }

    const borderClass = isSelected  ? "border-blue-700 border-2" : "border-zinc-500 border";
    return (
        <canvas
            ref={canvasRef}
            width={size}
            height={size}
            className={`block transition-all duration-75 ${borderClass}`
                }            
                style={{ imageRendering: 'pixelated',
            }}
            // onMouseDown={handleMouseDown}
            // onMouseUp={handleMouseUp}
            // onMouseMove={handleMouseMove}
            // onMouseLeave={handleMouseUp}
        />
    );
};