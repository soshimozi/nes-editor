'use client';

import React, {useEffect, useRef, useState} from 'react';
import { 
    createEmptyCHRSet, 
    getPixel, 
    setPixel,
    Tile, 
} from '@/core/chr';

import { Bounce, ToastContainer, toast } from 'react-toastify';
import { TileGrid } from '@/components/TileGrid';
import { usePerTileUndo } from '@/core/usePertileUndo';
import { MenuButton } from '@/components/MenuButton';
import { Tool, ToolSelector } from '@/components/ToolSelector';
import { TileQuadSelector } from '@/components/TileQuadSelector';
import { Group, Palette } from 'lucide-react';
import { SpritePreview } from '@/components/SpritePreview';
import { SpriteEditor } from '@/components/SpriteEditor';
import { PaletteBuilder } from '@/components/PaletteBuilder';
import { Tabs } from '@/components/Tabs';
import { Tab } from '@/components/Tab';
import { ColorDropdown } from '@/components/ColorDropdown';
import { NES_PALETTE, PaletteCollection } from '@/core/palette';
import { PaletteColorList } from '@/components/PaletteColorList';
import { Tooltip } from 'react-tooltip'

// type Tool = 'draw' | 'erase' | 'fill';

type UndoRedoSetPixelState = {
    tileIndex: number;
    x: number;
    y: number;
    color: number;
}


export default function Editor() {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [chr, setChr] = useState(() => createEmptyCHRSet());
    const [selectedTileIndex, setSelectedTileIndex] = useState(0);
    const [selectedColor, setSelectedColor] = useState(1);
    const [tool, setTool] = useState<Tool>('draw');
    // const [showAutosaveToast, setShowAutosaveToast] = useState(false);
    // const [showSavedToast, setShowSavedToast] = useState(false);
    const [newProjectOpen, setNewProjectOpen] = useState(false);
    const [quads, setQuads] = useState<[number, number, number, number]>([0, 0, 0, 0]);
    const [showPaletteSelector, setShowPaletteSelector] = useState(false);
    const [selectedPalettedIndex, setSelectedPaletteIndex] = useState(0);
    const [selectedColorIndex, setSelectedColorIndex] = useState(0);
    const [toastClosed, setToastClosed] = useState(true);
    const paletteContainerRef = useRef<HTMLDivElement>(null);
    const [undoHistory, setUndoHistory] = useState<UndoRedoSetPixelState[]>([]);
    const [redoHistory, setRedoHistory] = useState<UndoRedoSetPixelState[]>([]);
    

    const [palettes, setPalettes] = useState<[PaletteCollection, PaletteCollection, PaletteCollection, PaletteCollection]>([
        ["#B6DBFF", "#6DB6FF", "#006DDB", "#002492"],
        ["#B6DBFF", "#9292FF", "#0049FF", "#0000DB"],
        ["#B6DBFF", "#9200FF", "#DB6DFF", "#FFB6FF"],
        ["#B6DBFF", "#B600FF", "#FF00FF", "#FF92FF"],

    ]);      

    const [nesPalette, setNESPalette] = useState<string[]>(NES_PALETTE);
          
    //const [palette, setPalette] = useState<[string, string, string, string]>(palettes[0]);    

    //const tile = chr[selectedTileIndex] ?? new Uint8Array(16);

    // const handleDrawPixel = (x: number, y: number) => {
    //     const newTile = new Uint8Array(chr[selectedTileIndex]); // clone
    //     pushState(); // 👈 Save state before modifying
      
    //     if (tool === 'draw') setPixel(newTile, x, y, selectedColor);
    //     else if (tool === 'erase') setPixel(newTile, x, y, 0);
    //     else if (tool === 'fill') floodFill(newTile, x, y, selectedColor);
      
    //     const updated = [...chr];
    //     updated[selectedTileIndex] = newTile;
    //     setChr(updated);

    //     setShowAutosaveToast(true);        
    // };

    // const handleSaveJson = () => {
    //     try {
    //         const asm = exportCa65PaletteAsm(palettes[selectedTileIndex]);
    //         navigator.clipboard.writeText(asm);
    //         //setShowSavedToast(true); // optional toast feedback
    //     } catch (err) {
    //     alert((err as Error).message); // if palette is invalid
    //     }
    // }

    // const handleSaveChr = () => {
    //     const binary = chrToBinary(chr);
    //     const blob = new Blob([binary], { type: 'application/octet-stream' });
    //     const url = URL.createObjectURL(blob);

    //     const link = document.createElement('a');
    //     link.href = url;
    //     link.download = 'tiles.chr';
    //     link.click();

    //     URL.revokeObjectURL(url);
    // }

    // const handleExportAsm = () => {
    //     try {
    //     const asm = exportCa65PaletteAsm(palettes[selectedPalettedIndex]);
    //     navigator.clipboard.writeText(asm);
    //     //setShowSavedToast(true); // optional toast feedback
    //     } catch (err) {
    //     alert((err as Error).message); // if palette is invalid
    //     }
    // }

    // const handleSavePng = () => {
    //     const canvas = exportCHRAsPNG(chr, palettes[selectedPalettedIndex], 4);
    //     const link = document.createElement('a');
    //     link.href = canvas.toDataURL('image/png');
    //     link.download = 'tiles.png';
    //     link.click();

    // }

    const loadCHRFile = async (file: File) => {

        const buffer = await file.arrayBuffer();

        const raw = new Uint8Array(buffer);
        const tiles: Uint8Array[] = [];

        for (let i = 0; i < raw.length; i += 16) {
            tiles.push(raw.slice(i, i + 16));
        }

        setChr(tiles);

    };

    const rgbToHex = (r: number, g: number, b: number): string  => {
        const toHex = (c: number): string => {
          const hex = c.toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        };
      
        return "#" + toHex(r) + toHex(g) + toHex(b);
    }


    const loadPalFile = async (file: File) => {
        const buffer = await file.arrayBuffer();

        const raw = new Uint8Array(buffer);
        const colors: string[] = [];

        const p: string[] = [];
        for(let i = 0; i < raw.length; i += 3 ) {
            const red = raw[i];
            const green = raw[i + 1];
            const blue = raw[i + 2];

            p.push(rgbToHex(red, green, blue));
        }

        setNESPalette(p);
    }

    const updatePalette = (pindex: number, cindex: number, color: string) => {
        if(pindex != 0 && cindex == 0) return;

        setPalettes(prev => {

            // Step 1: Make a deep copy of the palettes
            const updated = prev.map(row => [...row]) as [PaletteCollection, PaletteCollection, PaletteCollection, PaletteCollection];

            // Step 2: Apply the drop
            updated[pindex][cindex] = color;

            // Step 3: Get the new first color from the first row
            const firstColor = updated[0][0];

            // Step 4: Copy that value into the first entry of all rows
            for (let i = 0; i < updated.length; i++) {
                updated[i][0] = firstColor;
            }

            return updated;            

        });
    }

    async function uploadFile(file: File) {
        const buffer = await file.arrayBuffer();


        if (file.name.endsWith('.json')) {
            const json = JSON.parse(new TextDecoder().decode(buffer));
            const loaded = json.map((arr: number[]) => new Uint8Array(arr));
            setChr(loaded);
        } else if (file.name.endsWith('.pal')) {
            await loadPalFile(file);
        } else if (file.name.endsWith('.chr')) {
            await loadCHRFile(file);
        }

        // Reset to tile 0 when loading
        setSelectedTileIndex(0);

    }

    async function handleUpload(file?: File) {
        //const file = e.target.files?.[0];
        if (!file) return;

        uploadFile(file);

    }

    async function handleGridDrop(file?: File) {
        if (!file) return;
        uploadFile(file);
    }

    function updateCHR(tile: Tile, index: number) {
        const updated = [...chr]
        updated[index] = tile;
        setChr(updated);

    }

    function redoState() {
        if(redoHistory.length == 0) return;

        const nextState = redoHistory[redoHistory.length - 1];

        const prevState:UndoRedoSetPixelState = {...nextState, color: getPixel(chr[nextState.tileIndex], nextState.x, nextState.y)}

        setRedoHistory(prev => prev.slice(0, -1));
        setUndoHistory(prev => [...prev, prevState]);

        const newTile = new Uint8Array(chr[nextState.tileIndex]);
        setPixel(newTile, nextState.x, nextState.y, nextState.color);

        updateCHR(newTile, nextState.tileIndex);
    }

    function undoState() {
        if(undoHistory.length == 0) return;

        const prevState = undoHistory[undoHistory.length - 1];

        setUndoHistory(prev => prev.slice(0, -1));

        const newState:UndoRedoSetPixelState = {...prevState, color: getPixel(chr[prevState.tileIndex], prevState.x, prevState.y)}

        console.log('newState: ', newState);
        setRedoHistory(prev => [...prev, newState]);

        const newTile = new Uint8Array(chr[prevState.tileIndex]); // clone
        setPixel(newTile, prevState.x, prevState.y, prevState.color);

        updateCHR(newTile, prevState.tileIndex);

        // const updated = [...chr]
        // updated[prevState.tileIndex] = newTile;
        // setChr(updated);
    }

    // TODO: move into component
    function onDrawPixel(x: number, y: number, quad: number): void {
        const tileIndex = quads[quad];

        console.log('tileIndex', tileIndex)
        const newTile = new Uint8Array(chr[tileIndex]); // clone

        var state:UndoRedoSetPixelState =  { x: x, y: y, tileIndex: tileIndex, color: getPixel(chr[tileIndex], x, y)}
        //undoHistory.push(state)

        setUndoHistory(prev => [...prev, state]);
        setRedoHistory(prev => prev.slice(0))
        setRedoHistory([]);

        setPixel(newTile, x, y, selectedColorIndex);
      
        // if (tool === 'draw') setPixel(newTile, x, y, selectedColor);
        // else if (tool === 'erase') setPixel(newTile, x, y, 0);
        // else if (tool === 'fill') floodFill(newTile, x, y, selectedColor);
      
        const updated = [...chr];
        updated[tileIndex] = newTile;
        setChr(updated);

        Notify("Auto saved");

        //setShowAutosaveToast(true);        
    }

    function Notify(msg: string) {
        if(!toastClosed) return;

        setToastClosed(false);
        toast(msg, { onClose: () => setToastClosed(true), theme: "dark", transition: Bounce, position: "bottom-left"});
    }

    return (
        <>
        <Tooltip id="my-tooltip" />        
        <ToastContainer limit={1} autoClose={3000} stacked={false} hideProgressBar={true} />
        <div className='ml-10'>
            <MenuButton
                title="File"
                items={[
                    //{ label: 'New Project', onClick: () => setNewProjectOpen(true) },
                    { label: 'Open File...', onClick: () => fileInputRef.current?.click() },
                    //{ label: 'Save', onClick: handleSaveChr },
                    //{ label: 'Save As Json', onClick: handleSaveJson },
                    //{ label: 'Save Tilesheet', onClick: handleSavePng },
                    // { label: 'Save .json', onClick: handleSaveJson },
                    // { label: 'Save Png', onClick: handleSavePng},
                    // { label: 'Export .asm (CA65)', onClick: handleExportAsm },
                ]}
            />

            <MenuButton
            title="Edit"
            items={[
                { label: 'Undo', onClick: undoState, disabled: undoHistory.length == 0 },
                { label: 'Redo', onClick: redoState, disabled: redoHistory.length == 0 },
            ]}
            />
        </div>
        
        <input
            style={{ position: 'absolute', left: -99999}}
            type="file"
            accept=".chr,.json,.pal,.map"
            ref={fileInputRef}
            onChange={async (e) => { await handleUpload(e.target.files?.[0]) }}
            className="text-sm"
        />                        

        <div className="ml-10">
        <Tabs>
            <Tab label="Tile Editor">
                <div className="flex items-start flex-row bg-zinc-300 p-2 gap-2">

                        <div className="flex flex-col gap-1">
                            <div className="w-[416px]">
                                <SpriteEditor quads={quads} chr={chr} palette={palettes[selectedPalettedIndex]} onDrawPixel={onDrawPixel} />
                            </div>
                            <div className="flex flex-row items-center gap-2">
                                <PaletteColorList palette={palettes[selectedPalettedIndex]}  onClicked={(index) => setSelectedColorIndex(index)} selected={selectedColorIndex} />
                                <div data-tooltip-id="my-tooltip" data-tooltip-content="Select a new palette" onClick={() => setShowPaletteSelector(true)} className='border border-zinc-900 rounded w-[48px] h-[48px] bg-purple-600 p-0 cursor-pointer hover:bg-purple-900'>

                                    <Palette size={48} color="#ffffff" strokeWidth={1} />

                                </div>
                            </div>
                            {showPaletteSelector && (
                                    <div ref={paletteContainerRef} className="animation-fade-in">
                                        <ColorDropdown palettes={palettes} onSelectPalette={(index) => { setSelectedPaletteIndex(index); setShowPaletteSelector(false);}} />
                                    </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-1">
                            <div>
                                <TileQuadSelector
                                            value={quads}
                                            onChange={setQuads}
                                            tileCount={chr.length} // dynamically from your loaded tiles
                                        />                          
                            </div>
                            <div>
                                <SpritePreview palette={palettes[selectedPalettedIndex]} chr={chr} quads={quads} />
                            </div>
                            <div>
                                <button className='mt-2 bg-green-500 border-zinc-900 border rounded p-2 cursor-pointer hover:bg-green-200 active:outline-2 active:outline-offset-2 active:outline-green-900 active:bg-green-500 hover:outline-2 hover:outline-offset-2 hover:outline-green-900'>Save To Nametable</button>
                            </div>
                        </div>
                        <div
                            className="h-[512px] overflow-y-scroll bg-white border-black border w-[450px]"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={async (e) => {
                                e.preventDefault();
                                handleGridDrop(e.dataTransfer.files?.[0])
                            }}>
                            <TileGrid
                                tiles={chr}
                                scale={6}
                                palette={palettes[selectedPalettedIndex]}
                            />
                        </div>    
                </div>
            </Tab>
            <Tab label="Maps">
                <div></div>
            </Tab>
            <Tab label="Palette Builder">
                <div>
                    <PaletteBuilder palette={nesPalette} palettes={palettes} onUpdate={updatePalette}/>
                </div>
            </Tab>
        </Tabs>
        </div>
        </>
    );
  };
  

  