import { usePlane } from '@react-three/cannon'
import { Mesh, RepeatWrapping, Texture } from 'three'
import { useMinecraftStore } from '@/hooks/useMinecraftStore'
import { ThreeEvent } from '@react-three/fiber'
import { texturesLoaded } from '@/lib/utils'

const groundTexture = texturesLoaded.get('grass_block_top')?.clone() as Texture
groundTexture.wrapS = RepeatWrapping
groundTexture.wrapT = RepeatWrapping
function Ground() {
  const [ref] = usePlane<Mesh>(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [-0.5, -0.5, -0.5],
  }))
  const { addCube, slots, hotBarCurrentSlot } = useMinecraftStore(
    (state) => state
  )

  groundTexture.repeat.set(100, 100)

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
      <meshStandardMaterial
        attach='material'
        map={groundTexture}
        color='#9ccb6c'
      />
    </mesh>
  )
}

export { Ground }
