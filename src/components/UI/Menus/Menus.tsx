import { TextureSelector } from '@/components/UI/HUD/TextureSelector'
import { PauseMenu } from '@/components/UI/Menus/PauseMenu'
import { MainMenu } from '@/components/UI/Menus/MainMenu'
import { useMenuStore } from '@/hooks/useMenuStore'
import { useKeyboard } from '@/hooks/useKeyboard'
import { useEffect } from 'react'
import { HotBar } from '../HUD/HotBar'
export function Menus() {
  const { mainMenu, pauseMenu, setPauseMenu } = useMenuStore()
  const { pause } = useKeyboard()
  useEffect(() => {
    if (pause) {
      setPauseMenu(!pauseMenu)
    }
  }, [pause])

  return (
    <>
      {!mainMenu && (
        <>
          <span className='pause-help'>Double Esc to pause</span>
          <HotBar />
          {pauseMenu && <PauseMenu />}
        </>
      )}
      {mainMenu && <MainMenu />}
    </>
  )
}
