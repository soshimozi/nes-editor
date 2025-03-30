'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Tile, getPixel } from '@/core/chr';
import { useRouter } from "next/router";
import { PaletteEditor } from './PaletteEditor';

type ColorSelectorProps = {
    onSelectColor?: (color: number) => void;
    palette: [string, string, string, string]; // NES-style palette: 4 color hex strings
    selectedColor: number; // callback for drawing
    onPaletteChanged?: (palette: [string, string, string, string]) => void;
};

export const ColorSelector: React.FC<ColorSelectorProps> = ({
    selectedColor,
    onSelectColor,
    palette,
    onPaletteChanged
}) => {

    const [showModal, setShowModal] = useState(false);

    function Modal() {
      
        return (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
            <div className="p-8 border w-96 shadow-lg rounded-md bg-white">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900">Modal Title</h3>
                <div className="mt-2 px-7 py-3">
                  <div className="text-lg text-gray-500">
                    <PaletteEditor selectedPalette={palette} onChange={(pal) => {onPaletteChanged && (onPaletteChanged(pal)) }} />
                  </div>
                </div>
                <div className="flex justify-center mt-4">
      
                  {/* Using useRouter to dismiss modal*/}
                  <button
                    onClick={() => {setShowModal(false)}}
                    className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    Close
                  </button>
      
                </div>
              </div>
            </div>
          </div>
        );
      }

    return (
        <div className="flex space-x-2">
            {showModal && (<Modal />)}
            {palette.map((color, i) => (
                <button
                    key={i}
                    onClick={() => onSelectColor && onSelectColor(i)}
                    className={`
                        w-8 h-8 rounded shadow
                        ${i === selectedColor ? 'ring-2 ring-red-500' : ''}
                    `}
                    style={{ backgroundColor: color }}
                />
            ))}                                
            <button onClick={() => setShowModal(true)} className='text-sm cursor-pointer hover:text-sky-800'>edit</button>
        </div>   
    )
};