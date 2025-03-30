import { NES_PALETTE, PaletteCollection } from "@/core/palette";
import { useEffect, useRef, useState } from "react";
import DraggableItem from "./DraggableItem";
import DropZone from "./DropZone";

interface NESPaletteViewerProps {
    palette: string[];
    palettes: [PaletteCollection, PaletteCollection, PaletteCollection, PaletteCollection];
    onUpdate?: (pindex: number, cindex: number, color: string) => void;
}

export const PaletteBuilder : React.FC<NESPaletteViewerProps> = ({palette, onUpdate, palettes}) => {

    const handleDrop = (color: string, paletteIndex: number, colorIndex: number): void => {

        onUpdate?.(paletteIndex, colorIndex, color);

    }

    return (
        <div className="flex flex-col gap-4 w-fit">
            <div className="grid grid-cols-16 grid-rows-4 gap-0 w-[778px] h-[202px] p-1 bg-zinc-900 border-zinc-300 border rounded">
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
        </div>
)
}