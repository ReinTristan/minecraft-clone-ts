import { PointerLockControls } from '@react-three/drei'
import { useMenuStore } from '@/store/useMenuStore'

function Fvp() {
  const { pauseMenu } = useMenuStore((state) => state)
  if (pauseMenu) return null
  return <PointerLockControls />
}

export { Fvp }
