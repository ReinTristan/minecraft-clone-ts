import { Physics } from "@react-three/cannon"
import { Sky } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { Ground } from "./components/Ground"
import { Fvp } from "./components/FVP"
import { Player } from "./components/Player"
import { Cubes } from "./components/Cubes"
import { TextureSelector } from "./components/TextureSelector"
import { Menu } from "./components/Menu"

function App() {

  return (
    <>
    <Canvas >
      <Sky sunPosition={[100, 100, 20]}/>
      <ambientLight intensity={1} />
      <Fvp />
      <Physics>
        <Cubes />
        <Ground />
        <Player />
      </Physics>
    </Canvas>
    <TextureSelector />
    <Menu />
    <div className="pointer">+</div>
    </>
  )
}

export default App
