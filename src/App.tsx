
import { GameScene } from "./components/GameScene"
import { Menus } from "./components/Menus"


function App() {
  return (
    <>
      <GameScene />
      <Menus />
      <span className='version-title'>Version {import.meta.env.VITE_CURRENT_VERSION}</span>

    </>
  )
}

export default App
