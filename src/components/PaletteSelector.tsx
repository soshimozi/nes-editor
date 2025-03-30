import { useState } from "react";
import { DropdownArrow } from "./DropDownArrow";


type PaletteViewProps = {
    selected?: number;
    palette: [string, string, string, string];
    onClicked?: (index: number) => void;
}

export const PaletteView : React.FC<PaletteViewProps> = ({selected, palette, onClicked}) => {
    
    return (
        <div className="flex flex-row gap-1">
            {palette.map((v, i) => (
                <div 
                  onClick={() => onClicked?.(i)}
                  key={i} 
                  style={{ backgroundColor: v, border: i == selected ? '1px solid black' : 'none' }}
                  className={`w-[48px] h-[48px] border border-zinc-300`}>
                </div>
            ))}
        </div>
    );
};

export type PaletteCollection = [string, string, string, string];

interface PaletteSelectorProps {
    palettes: PaletteCollection[];
    selectedPalette: PaletteCollection;
    onSelectPalette?: (paletteIndex: number) => void;
}

export const PaletteSelector: React.FC<PaletteSelectorProps> = ({selectedPalette, onSelectPalette, palettes}) => {
    // const palettes: [string, string, string, string][] = [
    //     ["#002492", "#0000DB", "#6DB6FF", "#B6DBFF"],
    //     ["#0000DB", "#0049FF", "#9292FF", "#DBB6FF"],
    //     ["#6D49DB", "#9200FF", "#DB6DFF", "#FFB6FF"],
    //     ["#92006D", "#B600FF", "#FF00FF", "#FF92FF"],

    // ];

    const [isOpen, setIsOpen] = useState(false);
    //const [selectedPalette, setSelectedPalette] = useState<[string, string, string, string]>(selectedPalette)

    return (
        <div className="relative w-fit">
            <div className="absolute mt-1 bg-white shadow-lg border border-gray-300 z-10 rounded flex flex-col gap-1 p-2">
              {palettes.map((v, i) => (
                <button
                  key={i}
                  onClick={() => {
                    onSelectPalette?.(i);
                    setIsOpen(false);
                  }}
                  className="hover:bg-zinc-300 rounded p-2"
                >
                  <PaletteView palette={v} />
                </button>
              ))}
            </div>
        </div>
      );
}