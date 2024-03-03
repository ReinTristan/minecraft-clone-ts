
import { TextureSelector } from "./TextureSelector"
import { PauseMenu } from "./PauseMenu"
import { MainMenu } from "./MainMenu"
import { useMenuStore } from "../hooks/useMenuStore"
import { useKeyboard } from "../hooks/useKeyboard"
import { useEffect } from "react"
export function Menus() {
  const {mainMenu, pauseMenu, setPauseMenu} = useMenuStore()
  const {pause} = useKeyboard()
  useEffect(() => {
        if(pause) {
            setPauseMenu(!pauseMenu)
        }
  }, [pause])

  return (
    <> 
    {!mainMenu && <>
      <span className="pause-help">Double Esc to pause</span>
      <TextureSelector />
      {pauseMenu && <PauseMenu />}
    </>}
    {mainMenu && <MainMenu />}
    </>
  )
}

