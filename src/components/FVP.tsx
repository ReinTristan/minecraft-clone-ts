import { PointerLockControls} from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useMenuStore } from '../hooks/useMenuStore'
function Fvp() {
    const {camera, gl} = useThree()
    const {pauseMenu} =useMenuStore()
    if(pauseMenu) return null
  return (
    <PointerLockControls args={[camera, gl.domElement]} />
  )
}

export { Fvp }