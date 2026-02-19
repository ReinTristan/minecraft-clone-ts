import { PointerLockControls } from '@react-three/drei'
import { useMenuStore } from '@/hooks/useMenuStore'

function Fvp() {
  const { pauseMenu } = useMenuStore((state) => state)
  if (pauseMenu) return null
  return <PointerLockControls />
}

export { Fvp }
