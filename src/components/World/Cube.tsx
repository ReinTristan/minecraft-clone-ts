import { useBox } from '@react-three/cannon'
import { ThreeEvent } from '@react-three/fiber'
import chroma from 'chroma-js'
import { useState } from 'react'
import { Mesh, MeshStandardMaterial } from 'three'
import { useMinecraftStore } from '@/hooks/useMinecraftStore'
import {
  combineTextures,
  getMaterialsInfoById,
  loadTextures,
} from '@/lib/utils'
import { ICube, TexturePosition, TexturePositionKey } from '@/types/cubes'

const FACE_DIRECTION_VALUES = {
  face0: [1, 0, 0],
  face1: [-1, 0, 0],
  face2: [0, 1, 0],
  face3: [0, -1, 0],
  face4: [0, 0, 1],
  face5: [0, 0, -1],
} as const
export const Cube = ({ id, pos: position, textureId }: ICube) => {
  const { removeCube, addCube, slots, hotBarCurrentSlot } = useMinecraftStore(
    (state) => state
  )
  const [isHovered, setIsHovered] = useState(false)
  const [ref] = useBox<Mesh>(() => ({
    type: 'Static',
    position,
  }))
  const textures = getMaterialsInfoById(textureId)
  const materials = Object.entries(textures.images).map(
    ([position, texture]) => {
      let textureColor =
        textures.properties.color?.[position as TexturePositionKey] ?? '#EEEEEE'
      const transparent = textures.type === 'transparent'

      return new MeshStandardMaterial({
        map: texture,
        color: isHovered
          ? chroma.blend(textureColor, '#BBBBBB', 'multiply').hex()
          : textureColor,
        transparent,
      })
    }
  )
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e?.stopPropagation()
    if (e.button === 2) {
      const faceIndex = e.faceIndex ?? 1
      const clickedFace = Math.floor(faceIndex / 2)
      const faceValues =
        FACE_DIRECTION_VALUES[
          `face${clickedFace}` as keyof typeof FACE_DIRECTION_VALUES
        ]
      const fullPosition = [
        position[0] + faceValues[0],
        position[1] + faceValues[1],
        position[2] + faceValues[2],
      ] as [number, number, number]
      const textureId = slots[hotBarCurrentSlot]
      if (!textureId) return
      addCube({ pos: fullPosition, textureId })
      return
    }
    removeCube(id)
  }
  return (
    <mesh
      ref={ref}
      onPointerMove={(e) => {
        e.stopPropagation()
        setIsHovered(true)
      }}
      onPointerLeave={(e) => {
        e.stopPropagation()
        setIsHovered(false)
      }}
      onPointerDown={handleClick}
    >
      <boxGeometry attach='geometry' />
      <primitive object={materials} attach='material' />
    </mesh>
  )
}
