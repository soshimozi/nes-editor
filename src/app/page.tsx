export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">NES Editor Tool</h1>
      <div className="flex flex-row gap-2">
      <a href="/tile-map-editor" className="bg-green-400 border border-zinc-800 rounded p-2">Tile Map Editor</a> 
      <a href="/sprite-editor" className="bg-blue-400 border border-zinc-800 rounded p-2">Sprite Editor</a>
      </div>

    </main>
  );
}
