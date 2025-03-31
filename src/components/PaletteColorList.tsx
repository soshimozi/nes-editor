'use client';

type PaletteColorListProps = {
    selected?: number;
    palette: [string, string, string, string];
    onClicked?: (index: number) => void;
}

export const PaletteColorList : React.FC<PaletteColorListProps> = ({selected, palette, onClicked}) => {
    
    return (
        <div className="flex flex-row gap-1">
            {palette.map((v, i) => {

                const className = i === selected ? "w-[48px] h-[48px] hover:border-white border-2 border-red-500" : "w-[48px] h-[48px] hover:border-white border-2 border-zinc-400"
                return (
                    <div 
                    onClick={() => onClicked?.(i)}
                    key={i} 
                    style={{ backgroundColor: v }}
                    className={className}>
                    </div>
                )
            })}
        </div>
    );
};