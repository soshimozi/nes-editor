'use client';

import { NES_PALETTE, PaletteCollection } from "@/core/palette";
import { useEffect, useRef, useState } from "react";
import DraggableItem from "./DraggableItem";
import DropZone from "./DropZone";

interface NESPaletteViewerProps {
    palette: string[];
    palettes: [PaletteCollection, PaletteCollection, PaletteCollection, PaletteCollection];
    onUpdate?: (pindex: number, cindex: number, color: string) => void;
}

interface ColorBoxProps {
    value: string; // expected to be a hex color string, e.g. "#aabbcc"
    index: number;
  }
  
  // Helper function to get Tailwind text color class based on brightness
  function getTextColor(backgroundColor: string): string {
    let r = 0, g = 0, b = 0;
  
    // Check if it's a hex string and handle shorthand (#abc) and full (#aabbcc)
    if (backgroundColor.startsWith('#')) {
      if (backgroundColor.length === 7) {
        r = parseInt(backgroundColor.slice(1, 3), 16);
        g = parseInt(backgroundColor.slice(3, 5), 16);
        b = parseInt(backgroundColor.slice(5, 7), 16);
      } else if (backgroundColor.length === 4) {
        r = parseInt(backgroundColor.charAt(1) + backgroundColor.charAt(1), 16);
        g = parseInt(backgroundColor.charAt(2) + backgroundColor.charAt(2), 16);
        b = parseInt(backgroundColor.charAt(3) + backgroundColor.charAt(3), 16);
      }
    }
  
    // Calculate brightness
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    // Return Tailwind CSS class based on brightness threshold
    return brightness > 128 ? 'text-black' : 'text-white';
  }
  
  // Optional: helper to pad the hex value (if needed)
  function padString(str: string, length: number): string {
    return str.padStart(length, '0');
  }
  
  const ColorBox: React.FC<ColorBoxProps> = ({ value, index }) => {
    const textColorClass = getTextColor(value);
  
    return (
      <div
        className="w-[48px] h-[48px] flex items-center justify-center border border-white"
        style={{ backgroundColor: value }}
      >
        <span className={`text-sm ${textColorClass}`}>
          {padString(index.toString(16), 2).toUpperCase()}
        </span>
      </div>
    );
  };

// Define the props for a single ColorCell
interface ColorCellProps {
    value: string;
    paletteIndex: number;
    colorIndex: number;
    onCellDropped: (id: string, paletteIndex: number, colorIndex: number) => void;
  }
  
  // ColorCell component encapsulates the conditional logic:
  // For all rows except the first row and only for the first column,
  // it renders a simple colored div; otherwise, it wraps the cell in a DropZone.
  const ColorCell: React.FC<ColorCellProps> = ({ value, paletteIndex, colorIndex, onCellDropped }) => {
    const cellContent = (
      <div
        style={{ backgroundColor: value }}
        className="w-[48px] h-[48px] border border-zinc-400"
      />
    );
  
    if (paletteIndex !== 0 && colorIndex === 0) {
      return cellContent;
    }
    
    return (
      <DropZone
        onDrop={(id) => onCellDropped(id, paletteIndex, colorIndex)}
        className="w-fit"
      >
        {cellContent}
      </DropZone>
    );
  };  

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
                            <ColorBox index={index} value={value} />
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
                                <ColorCell
                                value={value}
                                paletteIndex={pindex}
                                colorIndex={cindex}
                                onCellDropped={handleDrop}
                                />                                    
                                    {/* {pindex !==0 && cindex == 0 ? 
                                    (
                                        <div style={{backgroundColor: value}} className="w-[48px] h-[48px] border border-zinc-400"></div>
                                    ):
                                    (
                                        <DropZone onDrop={(id) => handleDrop(id, pindex, cindex)} className="w-fit">
                                            <div style={{backgroundColor: value}} className="w-[48px] h-[48px] border border-zinc-400"></div>
                                        </DropZone>
                                    )
                                    } */}
                                </div>
                            ))}
                        </div>
                    </div>

                ))}
            </div>
        </div>
)
}