import { Texture } from 'three'

export interface ICube {
  id: string
  pos: PositionType
  textureId: number
}

export interface TextureProperties {
  color?: {
    right?: string
    left?: string
    top?: string
    bottom?: string
    front?: string
    back?: string
  }
  overlay?: {
    right?: string
    left?: string
    top?: string
    bottom?: string
    front?: string
    back?: string
  }
  opacity?: number
}

export interface TextureInfo {
  id: number
  name: string
  textures: TexturePosition
  type: string
  properties: TextureProperties
}

export interface CubeFaces {
  top: Texture
  bottom: Texture
  left: Texture
  right: Texture
  front: Texture
  back: Texture
}

export interface TexturePosition {
  top: string
  bottom: string
  left: string
  right: string
  front: string
  back: string
}

export type TexturePositionKey = keyof TexturePosition

export interface TextureWithImages extends TextureInfo {
  images: CubeFaces
}

export type PositionType = [x: number, y: number, z: number]
