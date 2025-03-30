import { CHRData, getPixel } from "@/core/chr";
import { useEffect, useRef } from "react";


type ChrTileCanvasProps = {
    palette: [string, string, string, string]; // NES-style palette: 4 color hex strings
    quads: [number, number, number, number];
    chr: CHRData;
};

export const SpritePreview: React.FC<ChrTileCanvasProps> = ({
    palette,
    quads,
    chr
}) => {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const size = 192;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        console.log('rendering');

        const handle = requestAnimationFrame(() => {
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            ctx.clearRect(0, 0, size, size);

            const scale = 12;
            for(let q = 0; q < 4; q++) {
                const tile = chr[quads[q]];

                const xOffset = (q % 2) * 8;
                const yOffset =  Math.floor((q / 2)) * 8;

                for (let y = 0; y < 8; y++) {
                    for (let x = 0; x < 8; x++) {
                        const colorIndex = getPixel(tile, x, y) & 0b11;
                        ctx.fillStyle = palette[colorIndex] ?? '#000000';
                        ctx.fillRect((x + xOffset) * scale, (y + yOffset) * scale, scale, scale);
                    }
                }
            }
        });

    return () => cancelAnimationFrame(handle);

}, [chr, quads, palette]);   

    return (
        <canvas
            ref={canvasRef}
            width={size}
            height={size}
            className={`block border-2 transition-all duration-75`}            
                style={{ imageRendering: 'pixelated',
            }}
        />
    );
};