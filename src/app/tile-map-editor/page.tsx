'use client';

import React, {useEffect, useRef, useState} from 'react';
import { 
    createEmptyCHRSet, 
    getTilePixel, 
    setTilePixel,
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
import { useHotkeys } from '@/core/useHotKeys';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { DropdownArrow } from '@/components/DropDownArrow';

// type Tool = 'draw' | 'erase' | 'fill';

type SetPixelState = {
    tileIndex: number;
    x: number;
    y: number;
    color: number;
}

type FloodFillState = SetPixelState[];

type UndoRedoState = SetPixelState | FloodFillState;



export default function Editor() {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const paletteContainerRef = useRef<HTMLDivElement>(null);
    const toolContainerRef = useRef<HTMLDivElement>(null);

    const [chr, setChr] = useState(() => createEmptyCHRSet());
    const [tool, setTool] = useState<Tool>('draw');
    const [quads, setQuads] = useState<[number, number, number, number]>([0, 0, 0, 0]);
    const [showPaletteSelector, setShowPaletteSelector] = useState(false);
    const [selectedPalettedIndex, setSelectedPaletteIndex] = useState(0);
    const [selectedColorIndex, setSelectedColorIndex] = useState(0);
    const [toastClosed, setToastClosed] = useState(true);
    const [undoHistory, setUndoHistory] = useState<UndoRedoState[]>([]);
    const [redoHistory, setRedoHistory] = useState<UndoRedoState[]>([]);
    const [showToolSelector, setShowToolSelector] = useState(false);

    const [palettes, setPalettes] = useState<[PaletteCollection, PaletteCollection, PaletteCollection, PaletteCollection]>([
        ["#B6DBFF", "#6DB6FF", "#006DDB", "#002492"],
        ["#B6DBFF", "#9292FF", "#0049FF", "#0000DB"],
        ["#B6DBFF", "#9200FF", "#DB6DFF", "#FFB6FF"],
        ["#B6DBFF", "#B600FF", "#FF00FF", "#FF92FF"],

    ]);      

    const [nesPalette, setNESPalette] = useState<string[]>(NES_PALETTE);

    // useEffect(() => {
    //     const handleClickOutside = (event: MouseEvent) => {
    //     //   if (
    //     //     paletteContainerRef.current &&
    //     //     !paletteContainerRef.current.contains(event.target as Node)
    //     //   ) {
    //     //     setShowPaletteSelector(false);
    //     //   }

    //       if(
    //         toolContainerRef.current &&
    //         !toolContainerRef.current.contains(event.target as Node)
    //       ) {
    //         setShowToolSelector(false);
    //       }
    //     };
    
    //     document.addEventListener('mousedown', handleClickOutside);
    //     return () => {
    //       document.removeEventListener('mousedown', handleClickOutside);
    //     };
    //   }, []);      
                
    
    useHotkeys('z', 'ctrl', () => {
        undoState();
    });

    useHotkeys('y', 'ctrl', () => {
        redoState();
    });

    const floodFill = (tile: Tile, tileIndex: number, x: number, y: number, newColor: number) => {
        const targetColor = getTilePixel(tile, x, y);
        if (targetColor === newColor) return;
        
        const stack: [number, number][] = [[x, y]];
        const visited = new Set<string>();
        
        const key = (x: number, y: number) => `${x},${y}`;

        const stateStack:SetPixelState[] = [];
        
        while (stack.length > 0) {
            const [cx, cy] = stack.pop()!;
            if (cx < 0 || cx > 7 || cy < 0 || cy > 7) continue;
            if (visited.has(key(cx, cy))) continue;
        
            const currentColor = getTilePixel(tile, cx, cy);
            if (currentColor !== targetColor) continue;
        
            var state:SetPixelState =  { x: cx, y: cy, tileIndex: tileIndex, color: currentColor}
            stateStack.push(state);

            setTilePixel(tile, cx, cy, newColor);
            visited.add(key(cx, cy));
        
            stack.push([cx + 1, cy]);
            stack.push([cx - 1, cy]);
            stack.push([cx, cy + 1]);
            stack.push([cx, cy - 1]);
        }

        // put stack in history
        const floodState:FloodFillState = stateStack;
        pushHistory(floodState);
    }
    
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
        // const updated = [...chr]
        // updated[index] = tile;
        // setChr(updated);

        setChr(prev => {
            const updated = [...prev];
            updated[index] = new Uint8Array(tile); // copy to be safe
            return updated;
        });        

    }

    function isSetPixelState(obj: any): obj is SetPixelState {
        return typeof obj === 'object' && obj !== null && 'tileIndex' in obj;
    }

    function redoState() {
        if(redoHistory.length == 0) return;

        const state = redoHistory[redoHistory.length - 1];

        if(isSetPixelState(state)) {
            const nextState = state as SetPixelState;
            const prevState:UndoRedoState = {...nextState, color: getTilePixel(chr[nextState.tileIndex], nextState.x, nextState.y)}

            setRedoHistory(prev => prev.slice(0, -1));
            setUndoHistory(prev => [...prev, prevState]);

            const newTile = new Uint8Array(chr[nextState.tileIndex]);
            setTilePixel(newTile, nextState.x, nextState.y, nextState.color);

            updateCHR(newTile, nextState.tileIndex);
        } else {
            const nextState = state as FloodFillState;
            const prevState:FloodFillState = []

            // need to go through each element in newState and set the color appropriately.
            for(let i = 0; i < nextState.length; i++) {
                const pixelState:SetPixelState = { color: getTilePixel(chr[nextState[i].tileIndex], nextState[i].x, nextState[i].y), x: nextState[i].x, y: nextState[i].y, tileIndex: nextState[i].tileIndex};
                prevState.push(pixelState);
            }

            let tile = new Uint8Array(chr[nextState[0].tileIndex]);
            let tileIndex = nextState[0].tileIndex;
            for(let i = 0; i < nextState.length; i++) {
                const s = nextState[i];
                
                if(s.tileIndex != tileIndex) {
                    updateCHR(tile, tileIndex);        
                    
                    tileIndex = s.tileIndex;
                    tile = new Uint8Array(chr[tileIndex]);
                }

                setTilePixel(tile, s.x, s.y, s.color);

            }

            updateCHR(tile, tileIndex);

            setRedoHistory(prev => prev.slice(0, -1));
            setUndoHistory(prev => [...prev, prevState]);   
        }
    }

    function undoState() {
        if(undoHistory.length == 0) return;

        const state = undoHistory[undoHistory.length - 1];

        if(isSetPixelState(state)) {
            const prevState = state as SetPixelState;
            const newState:UndoRedoState = {...prevState, color: getTilePixel(chr[prevState.tileIndex], prevState.x, prevState.y)}

            setUndoHistory(prev => prev.slice(0, -1));
            setRedoHistory(prev => [...prev, newState]);

            const newTile = new Uint8Array(chr[prevState.tileIndex]); // clone
            setTilePixel(newTile, prevState.x, prevState.y, prevState.color);

            updateCHR(newTile, prevState.tileIndex);
        }
        else {
            const prevState = state as FloodFillState;
            const newState:FloodFillState = []

            // need to go through each element in newState and set the color appropriately.
             for(let i = 0; i < prevState.length; i++) {
                const pixelState:SetPixelState = { color: getTilePixel(chr[prevState[i].tileIndex], prevState[i].x, prevState[i].y), x: prevState[i].x, y: prevState[i].y, tileIndex: prevState[i].tileIndex };
                newState.push(pixelState);
            }

            let tile = new Uint8Array(chr[prevState[0].tileIndex]);
            let tileIndex = prevState[0].tileIndex;
            for(let i = 0; i < prevState.length; i++) {
                const s = prevState[i];
                
                if(s.tileIndex != tileIndex) {
                    updateCHR(tile, tileIndex);        
                    
                    tileIndex = s.tileIndex;
                    tile = new Uint8Array(chr[tileIndex]);
                }

                setTilePixel(tile, s.x, s.y, s.color);
            }

            updateCHR(tile, tileIndex);

            setUndoHistory(prev => prev.slice(0, -1));
            setRedoHistory(prev => [...prev, newState]);
        }
    }

    // TODO: move into component
    function onDrawPixel(x: number, y: number, quad: number): void {
        const tileIndex = quads[quad];
        const newTile = new Uint8Array(chr[tileIndex]); // clone

        var state:UndoRedoState =  { x: x, y: y, tileIndex: tileIndex, color: getTilePixel(chr[tileIndex], x, y)}
      
        if (tool === 'draw')  {
            pushHistory(state);
            setTilePixel(newTile, x, y, selectedColorIndex);
        }
        else if (tool === 'erase') {
            pushHistory(state);
            setTilePixel(newTile, x, y, 0);
        }
        else if (tool === 'fill') floodFill(newTile, tileIndex, x, y, selectedColorIndex);
      
        const updated = [...chr];
        updated[tileIndex] = newTile;
        setChr(updated);

        Notify("Auto saved");
    }

    function pushHistory(state: UndoRedoState | FloodFillState) {
        setUndoHistory(prev => [...prev, state]);
        setRedoHistory(prev => prev.slice(0))
        setRedoHistory([]);
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
                            <div className="w-[418px]">
                                <SpriteEditor quads={quads} chr={chr} palette={palettes[selectedPalettedIndex]} onDrawPixel={onDrawPixel} />
                            </div>
                            <div className='p-2 bg-zinc-500 rounded'>
                            <ToolSelector onSelect={(t) => { setTool(t); setShowToolSelector(false)}} selectedTool={tool} />
                            </div>
                            <div className="flex flex-row items-start gap-2">
                                <PaletteColorList palette={palettes[selectedPalettedIndex]}  onClicked={(index) => setSelectedColorIndex(index)} selected={selectedColorIndex} />
                                {/* <div className="flex flex-row gap-2">
                                    <button
                                            onClick={() => setShowPaletteSelector(!showPaletteSelector)} 
                                            className='border border-zinc-900 rounded w-[128px] h-[42px] bg-blue-400 p-0 cursor-pointer hover:bg-blue-200 active:bg-blue-600'>
                                        Select Palette

                                    </button>
                                </div> */}
                                <div className="flex flex-col justify-items-center">
                                    <button onClick={() => setShowPaletteSelector(!showPaletteSelector)}   
                                        className='w-[40px] h-[40px]
                                        rounded text-sm font-mono capitalize transition border border-zinc-900 
                                    shadow-sm shadow-zinc-900/50 bg-zinc-200 text-zinc-800 hover:bg-zinc-100 
                                    active:bg-zinc-200
                                    cursor-pointer'>
                                        <DropdownArrow direction={showPaletteSelector ? "up" : "down"} />
                                    </button>
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
                            <div className="flex flex-col justify-items-center">
                            <button
                                className={`px-3 py-1 rounded text-sm font-mono capitalize transition border border-zinc-900 
                                    shadow-sm shadow-zinc-900/50 bg-zinc-200 text-zinc-800 hover:bg-zinc-100 
                                    active:bg-zinc-200
                                    cursor-pointer`}
                            >
                                Save To Nametable
                            </button>
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
                <div>
                    <MarkdownRenderer content={"# Test markdown"} />
                </div>
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
  


  