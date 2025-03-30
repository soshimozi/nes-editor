import { NES_PALETTE } from "@/core/palette";
import { useEffect, useRef, useState } from "react";
import DraggableItem from "./DraggableItem";
import { PaletteCollection } from "./PaletteSelector";
import DropZone from "./DropZone";

interface NESPaletteViewerProps {
    palette: string[];
    palettes: [PaletteCollection, PaletteCollection, PaletteCollection, PaletteCollection];
    //onSave?: (palettes: [PaletteCollection, PaletteCollection, PaletteCollection, PaletteCollection]) => void;
    onUpdate?: (pindex: number, cindex: number, color: string) => void;
}

export const NESPaletteViewer : React.FC<NESPaletteViewerProps> = ({palette, onUpdate, palettes}) => {
    // const [palettes, setPalettes] = useState<[PaletteCollection, PaletteCollection, PaletteCollection, PaletteCollection]>([
    //     ["", "", "", ""],
    //     ["", "", "", ""],
    //     ["", "", "", ""],
    //     ["", "", "", ""]
    // ]);

    const handleDrop = (color: string, paletteIndex: number, colorIndex: number): void => {

        onUpdate?.(paletteIndex, colorIndex, color);
        
        //const palettesCopy = palettes;

        // ignore colorIndex 0 of any paletteIndex but 0

        //if(paletteIndex != 0 && colorIndex == 0) return;

        // setPalettes(prev => {
        //     // prev.map((row, i) =>
        //     //     i === paletteIndex
        //     //         ? row.map((val, j) => (j === colorIndex ? color : val)) as PaletteCollection
        //     //         : 
        //     //         colorIndex == 0 
        //     //         ? row.map((val, j) => (j === 0 ? prev[0][0] : val)) as PaletteCollection
        //     //         : 
        //     //         row
        //     // ) as [PaletteCollection, PaletteCollection, PaletteCollection, PaletteCollection]

        //     // Step 1: Make a deep copy of the palettes
        //     const updated = prev.map(row => [...row]) as [PaletteCollection, PaletteCollection, PaletteCollection, PaletteCollection];

        //     // Step 2: Apply the drop
        //     updated[paletteIndex][colorIndex] = color;

        //     // Step 3: Get the new first color from the first row
        //     const firstColor = updated[0][0];

        //     // Step 4: Copy that value into the first entry of all rows
        //     for (let i = 0; i < updated.length; i++) {
        //         updated[i][0] = firstColor;
        //     }

        //     return updated;            

        // });
    }

    return (
        <div className="flex flex-col gap-4 w-fit">
            <div className="grid grid-cols-16 grid-rows-4 gap-0 w-[778px] h-[202px] p-1 bg-zinc-900 border-zinc-300 border rounded">
                {/* <canvas width={768} height={192} ref={canvasRef} /> */}
                {palette.map((value, index) => (
                    <div key={index}>
                        <DraggableItem id={value}>
                            <div className="w-[48px] h-[48px] border border-white" style={{ backgroundColor: value }}></div>
                        </DraggableItem>
                    </div>
                ))}
            </div>
            <div className="flex flex-col gap-2">
                {palettes.map((p, pindex) => (
                    <div key={pindex}>
                        <div className="flex flex-row gap-4">
                            {p.map((value, cindex) => (
                                <div key={cindex} className="w-fit">
                                {pindex !==0 && cindex == 0 ? 
                                (
                                    <div style={{backgroundColor: value}} className="w-[48px] h-[48px] border border-zinc-400"></div>
                                ):
                                (
                                    <DropZone onDrop={(id) => handleDrop(id, pindex, cindex)} className="w-fit">
                                        <div style={{backgroundColor: value}} className="w-[48px] h-[48px] border border-zinc-400"></div>
                                    </DropZone>
                                )
                                }
                                </div>
                            ))}
                        </div>
                    </div>

                ))}
            </div>
            {/* <div >
                <button onClick={() => onSave?.(palettes) } className="float-right px-2 py-1 bg-green-500 text-zinc-100 w-[128px] border border-gray-300 rounded text-center cursor-pointer hover:bg-green-300">
                    Save
                </button>
            </div> */}
        </div>
)
}