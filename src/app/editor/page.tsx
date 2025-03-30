'use client';

import React, {useRef, useState} from 'react';
import { 
    createEmptyCHRSet, 
    setPixel, 
    floodFill, 
    Tile, 
    parseChrJson,
    exportCHRAsPNG,
    chrToBinary,
    exportCa65PaletteAsm
} from '@/core/chr';

import { ChrTileCanvas } from '@/components/ChrTileCanvas';
import { TileGrid } from '@/components/TileGrid';
import { usePerTileUndo } from '@/core/usePertileUndo';
import { Toast } from '@/components/Toast';
import { ColorSelector } from '@/components/ColorSelector';
import { MenuButton } from '@/components/MenuButton';
import { Tool, ToolSelector } from '@/components/ToolSelector';
import { TileQuadSelector } from '@/components/TileQuadSelector';
import { Group } from 'lucide-react';
import { SpritePreview } from '@/components/SpritePreview';
import { SpriteEditor } from '@/components/SpriteEditor';
import { NESPaletteViewer } from '@/components/NESPaletteViewer';
import { Tabs } from '@/components/Tabs';
import { Tab } from '@/components/Tab';
import { PaletteCollection, PaletteSelector, PaletteView } from '@/components/PaletteSelector';
import { NES_PALETTE } from '@/core/palette';

// type Tool = 'draw' | 'erase' | 'fill';

export default function Editor() {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [chr, setChr] = useState(() => createEmptyCHRSet());
    const [selectedTileIndex, setSelectedTileIndex] = useState(0);
    const [selectedColor, setSelectedColor] = useState(1);
    const [tool, setTool] = useState<Tool>('draw');
    const [showAutosaveToast, setShowAutosaveToast] = useState(false);
    const [showSavedToast, setShowSavedToast] = useState(false);
    const [newProjectOpen, setNewProjectOpen] = useState(false);
    const [quads, setQuads] = useState<[number, number, number, number]>([0, 0, 0, 0]);
    const [showPaletteSelector, setShowPaletteSelector] = useState(false);
    
    const {
        pushState,
        undo,
        redo,
        canUndo,
        canRedo
      } = usePerTileUndo(selectedTileIndex, chr[selectedTileIndex], (index, newTile) => {
        const updated = [...chr];
        updated[index] = newTile;
        setChr(updated);
      });

    const [palettes, setPalettes] = useState<PaletteCollection[]>([
        ["#B6DBFF", "#6DB6FF", "#006DDB", "#002492"],
        ["#DBB6FF", "#9292FF", "#0049FF", "#0000DB"],
        ["#6D49DB", "#9200FF", "#DB6DFF", "#FFB6FF"],
        ["#92006D", "#B600FF", "#FF00FF", "#FF92FF"],

    ]);      

    const [nesPalette, setNESPalette] = useState<string[]>(NES_PALETTE);
          
    const [palette, setPalette] = useState<[string, string, string, string]>(palettes[0]);    

    const tile = chr[selectedTileIndex] ?? new Uint8Array(16);

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

    const handleSaveJson = () => {
        try {
            const asm = exportCa65PaletteAsm(palette);
            navigator.clipboard.writeText(asm);
            setShowSavedToast(true); // optional toast feedback
        } catch (err) {
        alert((err as Error).message); // if palette is invalid
        }
    }

    const handleSaveChr = () => {
        const binary = chrToBinary(chr);
        const blob = new Blob([binary], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'tiles.chr';
        link.click();

        URL.revokeObjectURL(url);
    }

    const handleExportAsm = () => {
        try {
        const asm = exportCa65PaletteAsm(palette);
        navigator.clipboard.writeText(asm);
        setShowSavedToast(true); // optional toast feedback
        } catch (err) {
        alert((err as Error).message); // if palette is invalid
        }
    }

    const handleSavePng = () => {
        const canvas = exportCHRAsPNG(chr, palette, 4);
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'tiles.png';
        link.click();

    }

    const loadCHRFile = async (file: File) => {

        const buffer = await file.arrayBuffer();

        const raw = new Uint8Array(buffer);
        const tiles: Tile[] = [];

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

            
            //const rgb = ((red << 16) & 0xff0000) | ((green << 8) & 0x00ff00) | (blue & 0x0000ff);
            p.push(rgbToHex(red, green, blue));
        }

        //console.log(p);
        //setPalettes[palettes]
        setNESPalette(p);
    }

    async function handleUpload(file?: File) {
        //const file = e.target.files?.[0];
        if (!file) return;

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

    async function handleGridDrop(file?: File) {
        if (!file) return;

        const buffer = await file.arrayBuffer();
        if (file.name.endsWith('.json')) {
            const text = new TextDecoder().decode(buffer);
            const { tiles, palette: loadedPalette } = parseChrJson(text);
            setChr(tiles);
            setPalette(loadedPalette);
        } else {
            const raw = new Uint8Array(buffer);
            const tiles: Tile[] = [];
            for (let i = 0; i < raw.length; i += 16) {
                tiles.push(raw.slice(i, i + 16));
            }
            setChr(tiles);
        }

        setSelectedTileIndex(0);

    }

    // TODO: move into component
    function onDrawPixel(x: number, y: number, quad: number): void {
        const tileIndex = quads[quad];

        console.log('tileIndex', tileIndex)
        const newTile = new Uint8Array(chr[tileIndex]); // clone

        pushState(); // 👈 Save state before modifying

        setPixel(newTile, x, y, selectedColor);
        
      
        // if (tool === 'draw') setPixel(newTile, x, y, selectedColor);
        // else if (tool === 'erase') setPixel(newTile, x, y, 0);
        // else if (tool === 'fill') floodFill(newTile, x, y, selectedColor);
      
        const updated = [...chr];
        updated[tileIndex] = newTile;
        setChr(updated);

        setShowAutosaveToast(true);        
    }

    return (
        <>
        <div className='ml-10'>
            <MenuButton
                title="File"
                items={[
                    { label: 'New Project', onClick: () => setNewProjectOpen(true) },
                    { label: 'Open File...', onClick: () => fileInputRef.current?.click() },
                    { label: 'Save', onClick: handleSaveChr },
                    { label: 'Save As Json', onClick: handleSaveJson },
                    { label: 'Save Tilesheet', onClick: handleSavePng },
                    // { label: 'Save .json', onClick: handleSaveJson },
                    // { label: 'Save Png', onClick: handleSavePng},
                    // { label: 'Export .asm (CA65)', onClick: handleExportAsm },
                ]}
            />

            <MenuButton
            title="Edit"
            items={[
                { label: 'Undo', onClick: undo, disabled: !canUndo },
                { label: 'Redo', onClick: redo, disabled: !canRedo },
            ]}
            />
        </div>
        
        <Toast show={showAutosaveToast}>
            ✔ Autosaved
        </Toast>         
        <Toast show={showSavedToast}>
            🧠 Palette copied to clipboard
        </Toast>
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
                <div className="flex items-start flex-row bg-zinc-100 p-2 gap-2">

                        <div className="flex flex-col gap-1">
                            <div className="w-[416px]">
                                <SpriteEditor quads={quads} chr={chr} palette={palette} onDrawPixel={onDrawPixel} />
                            </div>
                            <div className="flex flex-row items-center gap-2">
                                <PaletteView palette={palette} />
                                <a href="#" onClick={() => setShowPaletteSelector(true)}>Select Palette</a>
                            </div>
                            {showPaletteSelector && (
                                    <div className="animation-fade-in">
                                        <PaletteSelector palettes={palettes} selectedPalette={palette} onSelectPalette={(p) => { setPalette(p); setShowPaletteSelector(false);}} />
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
                                <SpritePreview palette={palette} chr={chr} quads={quads} />
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
                                palette={palette}
                            />
                        </div>    
                </div>
            </Tab>
            <Tab label="Maps">
                <div></div>
            </Tab>
            <Tab label="Palette Builder">
                <div>
                    <NESPaletteViewer palette={nesPalette} />
                </div>
            </Tab>
        </Tabs>
        </div>
        </>
    );
  };
  

  