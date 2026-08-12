import { usePlane } from '@react-three/cannon'
import { ThreeEvent } from '@react-three/fiber'
import { useMemo } from 'react'
import { Mesh, RepeatWrapping } from 'three'
import { useMinecraftStore } from '@/hooks/useMinecraftStore'
import { createGroundTexture } from '@/lib/textures/registry'

function Ground() {
  const [ref] = usePlane<Mesh>(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [-0.5, -0.5, -0.5],
  }))
  const { addCube, slots, hotBarCurrentSlot } = useMinecraftStore(
    (state) => state
  )

  // Textura propia del suelo, no la compartida del bloque de césped: aquí lleva
  // RepeatWrapping ×100. Wrap y repeat se fijan una sola vez, no en cada render.
  const groundTexture = useMemo(() => {
    const texture = createGroundTexture()
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
    texture.repeat.set(100, 100)
    return texture
  }, [])

  const handleClickGround = (e: ThreeEvent<MouseEvent>) => {
    e?.stopPropagation()
    if (e.button !== 2) return
    const [x, y, z] = Object.values(e.point).map((n) => Math.ceil(n))
    const textureId = slots[hotBarCurrentSlot]
    if (!textureId) return
    addCube({ pos: [x, y, z], textureId })
  }

  return (
    <mesh ref={ref} onPointerDown={handleClickGround}>
      <planeGeometry attach='geometry' args={[100, 100]} />
      <meshStandardMaterial attach='material' map={groundTexture} />
    </mesh>
  )
}

export { Ground }
