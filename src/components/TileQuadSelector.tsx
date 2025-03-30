import DropZone from "./DropZone";

type TileQuadSelectorProps = {
    value: [number, number, number, number];
    onChange: (value: [number, number, number, number]) => void;
    tileCount: number; // optional prop
  };
  

export const TileQuadSelector: React.FC<TileQuadSelectorProps> = ({
    value,
    onChange,
    tileCount
  }) => {
    const handleChange = (i: number, newVal: number) => {
      const clamped = Math.max(0, Math.min(tileCount - 1, newVal));
      const updated = [...value] as [number, number, number, number];
      updated[i] = clamped;
      onChange(updated);
    };

    const handleDroppedItem = (index: number, id: string) => {
      handleChange(index, parseInt(id, 10) || 0);
    };

    return (
      <div className="grid grid-cols-2 grid-rows-2 gap-0 w-full h-[100px] p-0 justify-items-center bg-zinc-100 border-zinc-300 border rounded">
        {value.map((val, i) => (
          
          <div key={i}  className='w-full flex'>
            <DropZone onDrop={(id) => handleDroppedItem(i, id)} className="flex w-full">
              <input
                type="number"
                value={val}
                onChange={(e) => handleChange(i, parseInt(e.target.value, 10) || 0)}
                min={0}
                max={tileCount - 1}
                className={`text-center text-sm w-full p-1 border border-zinc-300`}
              />
            </DropZone>
          </div>
          
        ))}
      </div>
    );
  };
  