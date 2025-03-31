import { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { CHRData, getTilePixel } from '@/core/chr';
import DropZone from './DropZone';

type SpriteEditorProps = {
  selectedTileIndex: number;
  chr: CHRData;
  palette: [string, string, string, string];
  onDrawPixel?: (x: number, y: number) => void;
  onDropTile?: (tileId: string) => void;
};

export const TileEditor: React.FC<SpriteEditorProps> = ({ selectedTileIndex, chr, palette, onDrawPixel, onDropTile }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    const size = 416;
    const scale = 52;

    const getMouseCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / scale);
        const y = Math.floor((e.clientY - rect.top) / scale);

        return { x, y };
    }

    const handleMouseUp = () => {
        setIsDrawing(false);
    };

    const drawPixelUnderMouse = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const coords = getMouseCoords(e);

        // const x = coords.x % 8;
        // const y = coords.y % 8;

        // let quad = 0;

        // if(coords.x < 8 && coords.y < 8) {
        //     quad = 0;
        // } else if( coords.x < 8 && coords.y >= 8) {
        //     quad = 2;
        // } else if (coords.x >= 8 && coords.y < 8) {
        //     quad = 1;
        // } else {
        //     quad = 3;
        // }

        onDrawPixel?.(coords.x, coords.y);
    }

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if(!onDrawPixel) return;
        setIsDrawing(true);

        drawPixelUnderMouse(e);
    }

    const handleMouseMove = (e:React.MouseEvent<HTMLCanvasElement>) => {

        if(!isDrawing || !onDrawPixel) return;
        drawPixelUnderMouse(e);
    }


    useEffect(() => {
            const canvas = canvasRef.current;
            if (!canvas) return;
    
            const handle = requestAnimationFrame(() => {
                const ctx = canvas.getContext('2d');
                if (!ctx) return;
    
                ctx.clearRect(0, 0, size, size);

                for (let y = 0; y < 8; y++) {
                    for (let x = 0; x < 8; x++) {
                        const colorIndex = getTilePixel(chr[selectedTileIndex], x, y) & 0b11;
                        ctx.fillStyle = palette[colorIndex] ?? '#000000';
                        ctx.fillRect((x) * scale, (y) * scale, scale, scale);
                    }
                }                
    
                // for(let q = 0; q < 4; q++) {
                //     const tile = chr[quads[q]];
    
                //     const xOffset = (q % 2) * 8;
                //     const yOffset =  Math.floor((q / 2)) * 8;
    
                //     for (let y = 0; y < 8; y++) {
                //         for (let x = 0; x < 8; x++) {
                //             const colorIndex = getTilePixel(tile, x, y) & 0b11;
                //             ctx.fillStyle = palette[colorIndex] ?? '#000000';
                //             ctx.fillRect((x + xOffset) * scale, (y + yOffset) * scale, scale, scale);
                //         }
                //     }
                // }

                ctx.strokeStyle = '#EFEFEF';
                ctx.lineWidth = 1;

                // draw grid
                for (let x = 1; x < 8; x++) {
                    ctx.beginPath();
                    ctx.moveTo(x * 52, 0)
                    ctx.lineTo(x * 52, size);
                    ctx.stroke();
                    
                }

                for(let y = 1; y < 8; y++) {
                    ctx.beginPath();
                    ctx.moveTo(0, y * 52);
                    ctx.lineTo(size, y * 52);
                    ctx.stroke();
                }
            });
    
        return () => cancelAnimationFrame(handle);
    
    }, [selectedTileIndex, chr, palette]);
    
    return (
    <div className="border border-black" >
        <DropZone onDrop={(id) => onDropTile?.(id) }>
        <canvas 
            height={size} 
            width={size} 
            ref={canvasRef}                 
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            />
        </DropZone>
    </div>
    )
};