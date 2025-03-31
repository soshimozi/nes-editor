# NES CHR Editor

A modern, web-based NES tile editor built with **Next.js**, **TypeScript**, and **Tailwind CSS**.  
Create, edit, preview, and export `.chr` graphics with full palette control, tile-level undo/redo, and sprite assembly tools — all in your browser.

---

## ✨ Features

### 🎨 Tile Editing
- Edit 8×8 pixel tiles using NES-style 2-bit color
- Interactive drawing tools: **pencil**, **erase**, and **flood fill**
- Select active color from a 4-color background palette

### 🔄 Undo/Redo (Per Tile)
- Unlimited undo/redo stack for each tile individually
- Fully keyboard/mouse friendly

### 🧱 Tile Grid Viewer
- View all tiles in a resizable grid (supports 64, 256, 512+ tiles)
- Each tile displays its index for easy identification
- Click to select and edit any tile

### 🖼️ Tile Editor
- Enlarged view of selected tile for precise editing
- Draw or erase pixels with pixel-perfect scaling

### 🎛️ Color & Palette Control
- 4-color palettes rendered from NES master palette
- Shared application state using `zustand`
- Includes editable default 16-color background and sprite palettes

### 🧩 Metasprite Assembly (Quad Selector)
- Create 2×2 tile metasprites by selecting 4 tile indices
- Future: preview full metasprite and export to `.asm`

### 💾 File Support
- Load and save `.chr` files (raw 16-byte per tile format)
- Import/export JSON for custom project formats
- Export as PNG
- Drag-and-drop `.chr` files directly into the tile grid

### 🧠 CA65/ASM Export
- Copy default NES background and sprite palettes as `.byte` declarations
- Paste directly into a CA65 `.s` or `.inc` file

---

## 📦 Getting Started

```bash
pnpm install
pnpm dev
Then open http://localhost:3000