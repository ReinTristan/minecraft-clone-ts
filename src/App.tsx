import { GameScene } from '@/components/GameScene'
import { Menus } from '@/components/UI/Menus/Menus'

const version = import.meta.env.VITE_CURRENT_VERSION

function App() {
  return (
    <main className='font-mc fixed h-full w-full select-none'>
      <GameScene />
      <Menus />
      <span className='version-title'>Version {version}</span>
    </main>
  )
}

export default App
