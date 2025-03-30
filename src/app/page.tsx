export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">NES CHR Editor</h1>
      <p>Click below to start editing tiles!</p>
      <a href="/editor" className="text-blue-600 underline">Go to Editor</a>

      <div className="animate-fade-in">
        This will fade in!
      </div>
    </main>
  );
}
