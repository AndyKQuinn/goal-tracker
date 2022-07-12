function GameWindow() {
  return (
    <div className="min-h-full m-2 text-white border-4 border-white rounded-lg bg-grey-800 h-96">
      <main className="p-2">
        Game Window
      </main>
    </div>
  )
}

export default function Home() {
  return (
    <div>
      <div className="p-1 pt-4 font-mono text-3xl font-bold text-center text-red-600 bg-gradient-to-b from-grey-800 to-coal">
        Main Menu
      </div>
      <GameWindow />
    </div>
  )
}
