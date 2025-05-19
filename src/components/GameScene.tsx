import { Physics } from '@react-three/cannon'
import { Sky, Stats } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Ground } from '@/components/World/Ground'
import { Fvp } from '@/components/Player/FVP'
import { Player } from '@/components/Player/Player'
import { Cubes } from '@/components/World/Cubes'
import { useMenuStore } from '@/hooks/useMenuStore'
import { CrossHair } from '@/components/UI/HUD/CrossHair'

export function GameScene() {
  const { mainMenu, pauseMenu } = useMenuStore((state) => state)
  return (
    <>
      <Canvas>
        <Sky sunPosition={[100, 100, 20]} />
        {!mainMenu && (
          <>
            <ambientLight intensity={1} />
            <Fvp />
            <Physics>
              <Ground />
              <Player />
              <Cubes />
            </Physics>
          </>
        )}
        <Stats />
      </Canvas>
      {!mainMenu && !pauseMenu && <CrossHair />}
    </>
  )
}
