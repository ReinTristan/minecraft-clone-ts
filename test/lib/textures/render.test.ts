import { NearestFilter, SRGBColorSpace } from 'three'
import { describe, expect, it } from 'vitest'
import {
  composeFace,
  createFaceTexture,
  renderSprite,
  SPRITE_SIZE,
  tintCanvas,
} from '@/lib/textures/render'
import { SpriteDef } from '@/types/textures'

/** Construye un sprite válido a partir de 16 filas ya escritas. */
const spriteOf = (
  palette: Record<string, string>,
  rows: string[]
): SpriteDef => ({ palette, rows })

/** Sprite uniforme de un solo char, útil como base o como overlay opaco. */
const solid = (char: string, color: string): SpriteDef =>
  spriteOf({ [char]: color }, Array(SPRITE_SIZE).fill(char.repeat(SPRITE_SIZE)))

/** Lee el RGBA del píxel (x, y) de un canvas ya pintado. */
const pixelAt = (canvas: HTMLCanvasElement, x: number, y: number) => {
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('no 2d context')
  const [r, g, b, a] = ctx.getImageData(x, y, 1, 1).data
  return { r, g, b, a }
}

describe('renderSprite', () => {
  it('rasterizes each char with its exact palette color', () => {
    const canvas = renderSprite(solid('a', '#123456'))
    expect(pixelAt(canvas, 0, 0)).toEqual({ r: 0x12, g: 0x34, b: 0x56, a: 255 })
    expect(pixelAt(canvas, 15, 15)).toEqual({
      r: 0x12,
      g: 0x34,
      b: 0x56,
      a: 255,
    })
  })

  it('leaves the "." char fully transparent', () => {
    const rows = Array(SPRITE_SIZE).fill('a'.repeat(SPRITE_SIZE))
    rows[0] = `.${'a'.repeat(SPRITE_SIZE - 1)}`
    const canvas = renderSprite(spriteOf({ a: '#ffffff' }, rows))

    expect(pixelAt(canvas, 0, 0).a).toBe(0)
    expect(pixelAt(canvas, 1, 0).a).toBe(255)
  })

  it('produces a 16x16 canvas', () => {
    const canvas = renderSprite(solid('a', '#ffffff'))
    expect(canvas.width).toBe(SPRITE_SIZE)
    expect(canvas.height).toBe(SPRITE_SIZE)
  })

  // Las tres validaciones son la única defensa contra un sprite mal escrito a
  // mano, que es como se escriben todos.
  it('throws when the sprite does not have 16 rows', () => {
    const short = spriteOf({ a: '#fff' }, ['a'.repeat(SPRITE_SIZE)])
    expect(() => renderSprite(short, 'short')).toThrow(/16 rows/)
  })

  it('throws when a row is not 16 chars long', () => {
    const rows = Array(SPRITE_SIZE).fill('a'.repeat(SPRITE_SIZE))
    rows[7] = 'a'.repeat(SPRITE_SIZE - 1)
    expect(() => renderSprite(spriteOf({ a: '#fff' }, rows), 'row')).toThrow(
      /row 7/
    )
  })

  it('throws when a char is not in the palette', () => {
    const rows = Array(SPRITE_SIZE).fill('a'.repeat(SPRITE_SIZE))
    rows[3] = `q${'a'.repeat(SPRITE_SIZE - 1)}`
    expect(() =>
      renderSprite(spriteOf({ a: '#fff' }, rows), 'palette')
    ).toThrow(/not in palette/)
  })
})

describe('tintCanvas', () => {
  it('multiplies channel by channel', () => {
    // blanco x #6d9e46 = #6d9e46: el tinte se ve tal cual sobre blanco puro.
    const tinted = tintCanvas(renderSprite(solid('a', '#ffffff')), '#6d9e46')
    expect(pixelAt(tinted, 0, 0)).toEqual({
      r: 0x6d,
      g: 0x9e,
      b: 0x46,
      a: 255,
    })
  })

  it('only darkens: the result never exceeds the original', () => {
    const tinted = tintCanvas(renderSprite(solid('a', '#808080')), '#6d9e46')
    const { r, g, b } = pixelAt(tinted, 0, 0)
    expect(r).toBeLessThan(0x80)
    expect(g).toBeLessThan(0x80)
    expect(b).toBeLessThan(0x80)
  })

  it('leaves the source canvas untouched', () => {
    const base = renderSprite(solid('a', '#ffffff'))
    tintCanvas(base, '#000000')
    expect(pixelAt(base, 0, 0).r).toBe(255)
  })
})

describe('composeFace', () => {
  const sprites: Record<string, SpriteDef> = {
    base: solid('b', '#ff0000'),
    // opaco en la fila 0, transparente de la fila 1 hacia abajo
    overlay: spriteOf({ o: '#0000ff' }, [
      'o'.repeat(SPRITE_SIZE),
      ...Array(SPRITE_SIZE - 1).fill('.'.repeat(SPRITE_SIZE)),
    ]),
  }

  it('returns the bare base when there is no tint and no overlays', () => {
    const canvas = composeFace({ texture: 'base' }, sprites)
    expect(pixelAt(canvas, 0, 0)).toEqual({ r: 255, g: 0, b: 0, a: 255 })
  })

  it('covers with the overlay where it is opaque and shows the base where it is "."', () => {
    const canvas = composeFace(
      { texture: 'base', overlays: [{ texture: 'overlay' }] },
      sprites
    )
    expect(pixelAt(canvas, 0, 0)).toEqual({ r: 0, g: 0, b: 255, a: 255 })
    expect(pixelAt(canvas, 0, 5)).toEqual({ r: 255, g: 0, b: 0, a: 255 })
  })

  it('tints the overlay without tinting the base', () => {
    const canvas = composeFace(
      {
        texture: 'base',
        overlays: [{ texture: 'overlay', tint: '#808080' }],
      },
      sprites
    )
    expect(pixelAt(canvas, 0, 0).b).toBeLessThan(255)
    expect(pixelAt(canvas, 0, 5)).toEqual({ r: 255, g: 0, b: 0, a: 255 })
  })

  it('throws when the sprite does not exist', () => {
    expect(() => composeFace({ texture: 'missing' }, sprites)).toThrow(
      /not found/
    )
  })
})

describe('createFaceTexture', () => {
  it('configures the texture for pixel art', () => {
    const texture = createFaceTexture(renderSprite(solid('a', '#ffffff')))
    expect(texture.minFilter).toBe(NearestFilter)
    expect(texture.magFilter).toBe(NearestFilter)
    expect(texture.generateMipmaps).toBe(false)
    expect(texture.colorSpace).toBe(SRGBColorSpace)
  })
})
