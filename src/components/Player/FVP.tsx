import { PointerLockControls } from '@react-three/drei'
import { useMenuStore } from '@/hooks/useMenuStore'
function Fvp() {
  const { pauseMenu } = useMenuStore()
  if (pauseMenu) return null
  return <PointerLockControls />
}

export { Fvp }
