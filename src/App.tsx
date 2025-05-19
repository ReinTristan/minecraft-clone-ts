import { GameScene } from '@/components/GameScene'
import { Menus } from '@/components/UI/Menus/Menus'
import { Suspense } from 'react'
import { Info } from './components/UI/HUD/Info'
import { useMenuStore } from './hooks/useMenuStore'

function App() {
  const { mainMenu } = useMenuStore((state) => state)

  return (
    <Suspense
      fallback={<div className='fixed top-0 left-0 h-full w-full bg-black' />}
    >
      <main className='font-mc fixed h-full w-full select-none'>
        <GameScene />
        <Menus />
        {mainMenu && <Info />}
      </main>
    </Suspense>
  )
}

export default App
