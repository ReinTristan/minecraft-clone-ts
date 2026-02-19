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
  top: Texture<HTMLImageElement>
  bottom: Texture<HTMLImageElement>
  left: Texture<HTMLImageElement>
  right: Texture<HTMLImageElement>
  front: Texture<HTMLImageElement>
  back: Texture<HTMLImageElement>
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
