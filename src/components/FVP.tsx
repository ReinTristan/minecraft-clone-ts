import { PointerLockControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber'

function Fvp() {
    const {camera, gl} = useThree()
  return (
    <PointerLockControls args={[camera, gl.domElement]}/>
  )
}

export { Fvp }