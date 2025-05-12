import { usePlane } from '@react-three/cannon'
import { groundTexture } from '@/assets/textures/textures'
import { Mesh } from 'three'
import { useMinecraftStore } from '@/hooks/useMinecraftStore'
import { ThreeEvent } from '@react-three/fiber'
import { useState } from 'react'

function Ground() {
  const [isHovered, setIsHovered] = useState(false)

  const [ref] = usePlane<Mesh>(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [-0.5, -0.5, -0.5],
  }))
  const { addCube } = useMinecraftStore()
  groundTexture.repeat.set(100, 100)

  const handleClickGround = (e: ThreeEvent<MouseEvent>) => {
    e?.stopPropagation()
    if (e.button !== 2) return
    const [x, y, z] = Object.values(e.point).map((n) => Math.ceil(n))
    addCube(x, y, z)
  }

  return (
    <mesh ref={ref} onClick={handleClickGround}>
      <planeGeometry attach='geometry' args={[100, 100]} />
      <meshStandardMaterial
        attach='material'
        map={groundTexture}
        color={isHovered ? '#CCC' : 'white'}
      />
    </mesh>
  )
}

export { Ground }
