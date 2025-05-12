import { useBox } from '@react-three/cannon'
import { Mesh } from 'three'
import { texturesObj } from '@/assets/textures/textures'
import { useEffect, useState } from 'react'
import { ICube, useMinecraftStore } from '@/hooks/useMinecraftStore'
import { ThreeEvent } from '@react-three/fiber'

const FACE_DIRECTION_VALUES = {
  face0: [1, 0, 0],
  face1: [-1, 0, 0],
  face2: [0, 1, 0],
  face3: [0, -1, 0],
  face4: [0, 0, 1],
  face5: [0, 0, -1],
} as const
export const Cube = ({ id, pos: position, texture }: ICube) => {
  const { removeCube, addCube } = useMinecraftStore()
  const [isHovered, setIsHovered] = useState(false)
  const [ref] = useBox<Mesh>(() => ({
    type: 'Static',
    position,
  }))

  const activeTexture =
    texturesObj[`${texture}Texture` as keyof typeof texturesObj]
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e?.stopPropagation()
    if (e.button === 2) {
      const faceIndex = e.faceIndex ?? 1
      const clickedFace = Math.floor(faceIndex / 2)
      const faceValues =
        FACE_DIRECTION_VALUES[
          `face${clickedFace}` as keyof typeof FACE_DIRECTION_VALUES
        ]

      addCube(
        position[0] + faceValues[0],
        position[1] + faceValues[1],
        position[2] + faceValues[2]
      )

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
      <meshStandardMaterial
        map={activeTexture}
        attach='material'
        color={isHovered ? '#CCC' : 'white'}
        transparent={true}
        opacity={texture === 'glass' ? 0.6 : 1}
      />
    </mesh>
  )
}
