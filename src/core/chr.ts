import { DEFAULT_NES_BG_PALETTE, DEFAULT_NES_SPRITE_PALETTE, NES_PALETTE } from "./palette";

export type Tile = Uint8Array;   // 16 bytes per tile (NES format)
export type CHRData = Tile[];

/**
 * Create an empty CHR set of tiles.
 * Each tile is initialized to 0 (all pixels transparent)
 */
export function createEmptyCHRSet(tileCount: number = 256): CHRData {
    return Array.from({length: tileCount}, () => new Uint8Array(16));
}

/**
 * Read the color of a pixel in a tile
 * @param tile - The 16-byte NES tile data.
 * @param x - Column (0-7)
 * @param y - Row (0-7)
 * @returns color index (0-3)
 */
export function getTilePixel(tile: Tile, x: number, y: number): number {
    const plane0 = (tile[y] >> (7 - x))  & 1;
    const plane1 = (tile[y + 8] >> (7 - x)) & 1;
    return (plane1 << 1) | plane0;
}

/**
 * Set the color of a pixel in a tile
 * @param tile - The 16-byte NES tile data.
 * @param x - Column (0-7)
 * @param y - Row (0-7)
 * @param color - Color index (0-3)
*/
export function setTilePixel(tile: Tile, x: number, y: number, color: number): void {
  const bit0 = color & 1;
  const bit1 = (color >> 1) & 1;

  const mask = ~(1 << (7 - x));

  // Update plane 0
  tile[y] = (tile[y] & mask) | (bit0 << (7 - x));
  // Update plane 1
  tile[y + 8] = (tile[y + 8] & mask) | (bit1 << (7 - x));
}

// export function floodFillTile(tile: Tile, x: number, y: number, newColor: number): void {
//   const targetColor = getTilePixel(tile, x, y);
//   if (targetColor === newColor) return;

//   const stack: [number, number][] = [[x, y]];
//   const visited = new Set<string>();

//   const key = (x: number, y: number) => `${x},${y}`;

//   while (stack.length > 0) {
//     const [cx, cy] = stack.pop()!;
//     if (cx < 0 || cx > 7 || cy < 0 || cy > 7) continue;
//     if (visited.has(key(cx, cy))) continue;

//     const currentColor = getTilePixel(tile, cx, cy);
//     if (currentColor !== targetColor) continue;

//     setTilePixel(tile, cx, cy, newColor);
//     visited.add(key(cx, cy));

//     stack.push([cx + 1, cy]);
//     stack.push([cx - 1, cy]);
//     stack.push([cx, cy + 1]);
//     stack.push([cx, cy - 1]);
//   }
// }


export function exportCHRAsPNG(chr: Tile[], palette: string[], tileScale = 8): HTMLCanvasElement {
    const cols = 16;
    const rows = Math.ceil(chr.length / cols);
    const canvas = document.createElement('canvas');
    canvas.width = cols * tileScale * 8;
    canvas.height = rows * tileScale * 8;
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;
  
    for (let i = 0; i < chr.length; i++) {
      const tile = chr[i];
      const col = i % cols;
      const row = Math.floor(i / cols);
  
      for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
          const colorIndex = getTilePixel(tile, x, y) & 0b11;
          ctx.fillStyle = palette[colorIndex] ?? '#000000';
          ctx.fillRect(
            (col * 8 + x) * tileScale,
            (row * 8 + y) * tileScale,
            tileScale,
            tileScale
          );
        }
      }
    }
  
    return canvas;
  }
  
// Converts CHRData to a Uint8Array for .chr file
export function chrToBinary(chr: Tile[]): Uint8Array {
    const buffer = new Uint8Array(chr.length * 16);
    chr.forEach((tile, i) => {
      buffer.set(tile, i * 16);
    });
    return buffer;
  }
  
  // Converts CHRData to a JSON string
export function chrToJson(chr: Tile[]): string {
    return JSON.stringify(chr.map(t => Array.from(t)));
}
  

export function chrToJsonWithMetadata(chr: Tile[], palette: string[]) {
    return JSON.stringify({
      meta: {
        format: 'nes-chr-editor',
        created: new Date().toISOString(),
        tiles: chr.length,
      },
      palette,
      tiles: chr.map(t => Array.from(t)),
    }, null, 2);
  }
  
  export function parseChrJson(json: string): { tiles: Tile[],   palette: [string, string, string, string] } {
    const parsed = JSON.parse(json);
    const tiles = (parsed.tiles ?? []).map((t: number[]) => new Uint8Array(t));
    const palette = parsed.palette ?? ['#000', '#555', '#aaa', '#fff'];
    return { tiles, palette };
  }
  
  export function exportCa65PaletteAsm(palette: [string, string, string, string]): string {
    const bytes = palette.map(color => {
      const index = NES_PALETTE.findIndex(c => c.toUpperCase() === color.toUpperCase());
      if (index === -1) throw new Error(`Color ${color} not found in NES master palette`);
      return index;
    });
  
    const hexBytes = bytes.map(b => `$${b.toString(16).padStart(2, '0')}`);
    const comment = bytes.map(b => NES_PALETTE[b]);
  
    return `; NES CHR Editor palette\npalette:\n  .byte ${hexBytes.join(', ')}  ; ${comment.join(', ')}\n`;
  }

  function chunkArray<T>(arr: T[], chunkSize: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      result.push(arr.slice(i, i + chunkSize));
    }
    return result;
  }
  
  function wrapByteLines(arr: number[], perLine = 4): string[] {
    return chunkArray(arr, perLine).map(
      line => '  .byte ' + line.map(b => `$${b.toString(16).padStart(2, '0')}`).join(', ')
    );
  }
  
  export function exportDefaultNesPalettesAsm(): string {
    const bg = wrapByteLines(DEFAULT_NES_BG_PALETTE).join('\n');
    const sprite = wrapByteLines(DEFAULT_NES_SPRITE_PALETTE).join('\n');
  
    return `; NES default palettes (background + sprite)\nbg_palette:\n${bg}\nsprite_palette:\n${sprite}`;
  }
  