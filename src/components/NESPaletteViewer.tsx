import { NES_PALETTE } from "@/core/palette";
import { useEffect, useRef } from "react";


export const NESPaletteViewer : React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {

        const handle = requestAnimationFrame(() => {

            drawMasterPalette();

            function drawMasterPalette() {
                const canvas = canvasRef.current;
                if (!canvas) return;

                const ctx = canvas.getContext('2d');
                if (!ctx) return;
    
                ctx.clearRect(0, 0, 768, 192);
    
                ctx.fillStyle = "#000000";
                ctx.fillRect(0, 0, 768, 192);

                NES_PALETTE.forEach((val, index) => {
                    // x is determined by index % 16
                    // y is determined by index / 16
    
                    const x = index % 16;
                    const y = Math.floor(index / 16);
    
                    console.log(`index: ${index}, location: (${x}, ${y}), fill: ${val}`);
    
                    ctx.fillStyle = val;
                    ctx.fillRect(x * 48 + 1, y * 48 + 1, 46, 46);
                })
    
            }

        });

        return () => cancelAnimationFrame(handle);
    }, []); 


    return (
        <div>
            <canvas width={768} height={192} ref={canvasRef} />
        </div>
)
}