'use client';

import { PaletteCollection } from "@/core/palette";


interface PaletteSelectorProps {
    palettes: PaletteCollection[];
    onSelectPalette?: (paletteIndex: number) => void;
}

export const ColorDropdown: React.FC<PaletteSelectorProps> = ({onSelectPalette, palettes}) => {

    return (
        <div className="relative w-fit">
            <div className="absolute mt-1 bg-white shadow-lg border border-gray-300 z-10 rounded flex flex-col gap-1 p-2">
              {palettes.map((palette, i) => (
                <button
                  key={i}
                  onClick={() => {
                    onSelectPalette?.(i);
                  }}
                  className="hover:bg-zinc-300 rounded p-2"
                >
                <div className="flex flex-row gap-1">
                    {palette.map((v, i) => (
                        <div 
                          key={i} 
                          style={{ backgroundColor: v }}
                          className={`w-[48px] h-[48px] border border-zinc-300`}>
                        </div>
                    ))}
                </div>
                </button>
              ))}
            </div>
        </div>
      );
}