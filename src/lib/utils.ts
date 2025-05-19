import blocksInfo from '@/data/blocks_info.json' with { type: 'json' }
import textureList from '@/data/texture_list.json' with { type: 'json' }
import {
  CubeFaces,
  TextureInfo,
  TexturePosition,
  TexturePositionKey,
  TextureWithImages,
} from '@/types/cubes'
import {
  Texture,
  TextureLoader,
  MeshStandardMaterial,
  NearestFilter,
  CanvasTexture,
} from 'three'
export const texturesData = new Map<number, TextureInfo>(
  blocksInfo.cubes.map((texture) => [texture.id, texture])
)

export const texturesLoaded = new Map<string, Texture>(
  textureList.map((image) => {
    const texture = new TextureLoader().load(
      `/src/assets/textures/${image.path}`
    )
    texture.magFilter = NearestFilter
    return [image.name, texture]
  })
)

export function getMaterialsInfoById(id: number) {
  const textureInfo = texturesData.get(id) ?? texturesData.get(1)
  if (!textureInfo) {
    throw new Error(`Texture with id ${id} not found`)
  }
  const loadedTextures = loadTextures(textureInfo.textures)
  const hasOverlay = textureInfo.properties.overlay
  if (hasOverlay) {
    const overlayTextures = loadTextures(
      textureInfo.properties.overlay as TexturePosition
    )
    Object.entries(overlayTextures).forEach(([key, texture]) => {
      const originalTexture = loadedTextures[key as TexturePositionKey]
      if (originalTexture) {
        const combinedTexture = combineTextures({
          texture2: originalTexture.image,
          texture1: texture.image,
        })
        loadedTextures[key as TexturePositionKey] = combinedTexture
      }
    })
  }
  return { images: loadedTextures, ...textureInfo } as TextureWithImages
}

export function loadTextures(textures: TexturePosition) {
  return Object.entries(textures).reduce(
    (acc, [key, value]: [string, string]) => {
      const texture = texturesLoaded.get(value)
      if (!texture) {
        throw new Error(`Texture ${value} not found`)
      }
      acc[key as keyof CubeFaces] = texture
      return acc
    },
    {} as CubeFaces
  )
}

export const initialTexturesIds = blocksInfo.cubes
  .slice(0, 9)
  .map((texture) => texture.id)

export function combineTextures({
  texture1,
  texture2,
}: {
  texture1: Texture
  texture2: Texture
}) {
  const combinedTexture = new Texture()
  combinedTexture.image = {
    width: Math.max(texture1.image.width, texture2.image.width),
    height: Math.max(texture1.image.height, texture2.image.height),
  }
  combinedTexture.needsUpdate = true
  return combinedTexture
}

export async function combineTextures2({
  texture1,
  texture2,
  texture1Color = '#ff0000',
  texture2Color = '#00ff00',
}: {
  texture1: string
  texture2: string
  texture1Color?: string
  texture2Color?: string
}) {
  const baseImg = await loadImageAsync(texture1)
  const overlayImg = await loadImageAsync(texture2)
  const width = baseImg.width
  const height = baseImg.height
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

  // Dibuja la base
  ctx.drawImage(baseImg, 0, 0)

  // Tinta la overlay antes de dibujarla
  ctx.globalCompositeOperation = 'source-atop'
  ctx.fillStyle = '#ff0000' // El color que quieras
  ctx.fillRect(0, 0, width, height)

  // Dibuja la overlay encima (debe tener transparencia)
  ctx.globalCompositeOperation = 'destination-atop'
  ctx.drawImage(overlayImg, 0, 0)

  // Vuelve a la operación normal
  ctx.globalCompositeOperation = 'source-over'

  // Usa el canvas como textura
}

function loadImageAsync(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}
