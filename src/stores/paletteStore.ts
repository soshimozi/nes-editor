import { create } from 'zustand';

export type NesPalette = number[]; // 16 entries

type PaletteStore = {
  bgPalette: NesPalette;
  spritePalette: NesPalette;
  setBgPalette: (palette: NesPalette) => void;
  setSpritePalette: (palette: NesPalette) => void;
};

export const usePaletteStore = create<PaletteStore>((set) => ({
  bgPalette: [
    0x0F, 0x01, 0x21, 0x31,
    0x0F, 0x03, 0x13, 0x23,
    0x0F, 0x06, 0x16, 0x26,
    0x0F, 0x09, 0x19, 0x29,
  ],
  spritePalette: [
    0x0F, 0x02, 0x12, 0x22,
    0x0F, 0x04, 0x14, 0x24,
    0x0F, 0x07, 0x17, 0x27,
    0x0F, 0x0A, 0x1A, 0x2A,
  ],
  setBgPalette: (palette) => set({ bgPalette: palette }),
  setSpritePalette: (palette) => set({ spritePalette: palette }),
}));
