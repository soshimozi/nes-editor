'use client';

import React, { useState } from 'react';
import { NES_PALETTE } from '@/core/palette';

type PaletteEditorProps = {
  selectedPalette: [string, string, string, string];
  onChange: (newPalette: [string, string, string, string]) => void;
};

export const PaletteEditor: React.FC<PaletteEditorProps> = ({
  selectedPalette,
  onChange,
}) => {
  const [activeSlot, setActiveSlot] = useState<number>(0);

  const handleColorSelect = (color: string) => {
    const newPalette = [...selectedPalette] as [string, string, string, string];
    newPalette[activeSlot] = color;
    onChange(newPalette);
  };

  return (
    <div className="space-y-4">
      {/* Active Palette Slots */}
      <div className="text-sm font-semibold m-0">Active Palette</div>
      <div className="flex space-x-2">
        {selectedPalette.map((color, index) => (
          <button
            key={index}
            onClick={() => setActiveSlot(index)}
            className={`
              w-10 h-10 border-2 rounded
              ${index === activeSlot ? 'border-blue-500' : 'border-gray-400'}
            `}
            style={{ backgroundColor: color }}
            title={`Color ${index}`}
          />
        ))}
      </div>

      {/* NES Palette Grid */}
      <div className="text-sm font-semibold m-0">NES Palette</div>
      <div
        className="grid grid-cols-8 gap-1 p-2 bg-zinc-800 rounded shadow"
        style={{ width: 'fit-content' }}
      >
        {NES_PALETTE.map((color, index) => (
          <button
            key={index}
            onClick={() => handleColorSelect(color)}
            className="w-6 h-6 border border-zinc-600 hover:border-white"
            style={{ backgroundColor: color }}
            title={`Index ${index}`}
          />
        ))}
      </div>
    </div>
  );
};
