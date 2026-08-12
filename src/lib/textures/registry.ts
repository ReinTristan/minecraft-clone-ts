import type { CanvasTexture, Texture } from 'three'
import { blocks, FALLBACK_BLOCK_ID } from '@/data/blocks'
import { composeFace, createFaceTexture } from '@/lib/textures/render'
import { sprites } from '@/lib/textures/sprites'
import {
  type BlockDef,
  FACES,
  type Face,
  type FaceSpec,
} from '@/types/textures'

// `blocks` conserva sus tipos literales por el `satisfies`, lo que impide
// indexar `faces` por una `Face` cualquiera. Esta vista ensanchada es la que
// se recorre aquí.
const defs: BlockDef[] = blocks

export interface BlockTextures {
  faces: Record<Face, Texture>
  /** dataURL de la cara superior, para el <img> de la hotbar */
  iconUrl: string
  type: BlockDef['type']
  opacity: number
}

const registry = new Map<number, BlockTextures>()

/**
 * La promesa de carga, memoizada a nivel de módulo. Tiene que ser **la misma
 * instancia** en cada llamada: `<TexturesGate>` la pasa a `use()`, y `use()`
 * exige una promesa estable entre renders (ver `loadAllTextures`).
 */
let loading: Promise<void> | null = null

const resolveFace = (block: BlockDef, face: Face): FaceSpec =>
  block.faces[face] ?? block.faces.all

// Dos caras con el mismo sprite + tinte + overlays son la misma imagen: se
// componen una vez y comparten CanvasTexture. Con los 9 bloques actuales esto
// baja de 54 composiciones a ~12.
const faceCacheKey = (spec: FaceSpec) =>
  JSON.stringify([spec.texture, spec.tint ?? null, spec.overlays ?? null])

function build() {
  const cache = new Map<
    string,
    { canvas: HTMLCanvasElement; texture: CanvasTexture }
  >()

  const compose = (spec: FaceSpec) => {
    const key = faceCacheKey(spec)
    let entry = cache.get(key)
    if (!entry) {
      const canvas = composeFace(spec, sprites)
      entry = { canvas, texture: createFaceTexture(canvas) }
      cache.set(key, entry)
    }
    return entry
  }

  for (const block of defs) {
    const faces = {} as Record<Face, Texture>
    for (const face of FACES) {
      faces[face] = compose(resolveFace(block, face)).texture
    }
    registry.set(block.id, {
      faces,
      iconUrl: compose(resolveFace(block, 'top')).canvas.toDataURL(),
      type: block.type,
      opacity: block.opacity ?? 1,
    })
  }
}

/**
 * Genera todas las texturas. Se llama desde `<TexturesGate>` vía `use()`.
 *
 * Cuidado al tocar esta función: la forma es deliberada y sostiene tres cosas.
 *
 * 1. **No puede ser `async`.** Una función `async` devuelve una promesa nueva
 *    en cada llamada, aunque el resultado sea el mismo. `use()` recibiría una
 *    promesa distinta en cada render → suspende → re-renderiza → otra promesa
 *    → bucle infinito. Lo memoizado tiene que ser el objeto promesa, y esta
 *    función limitarse a devolverlo.
 * 2. **La IIFE `async` no es adorno.** Con `Promise.resolve(build())`, si
 *    `build()` lanza (p.ej. un sprite con un char fuera de paleta: `render.ts`
 *    valida y tira) el error saldría *síncrono* y `loading` se quedaría en
 *    `null`, así que el siguiente render reintentaría en bucle. Envuelto en la
 *    IIFE el fallo se memoiza igual que el éxito: revienta una vez, `use()`
 *    re-lanza el rechazo al error boundary, y ahí acaba.
 * 3. **Bonus `<StrictMode>`:** el doble montaje en dev no compone dos juegos
 *    de texturas.
 *
 * Hoy `build()` es 100% síncrono y la promesa es arquitectura, no necesidad.
 * Está así para que cuando generar texturas tarde de verdad (featurs para: 0.7.0: chunks y
 * muchos más bloques) baste con meter un `await` dentro de la IIFE, sin tocar
 * ni esta firma ni el gate.
 */
export function loadAllTextures(): Promise<void> {
  loading ??= (async () => build())()
  return loading
}

export function getBlockTextures(id: number): BlockTextures {
  const entry = registry.get(id) ?? registry.get(FALLBACK_BLOCK_ID)
  if (!entry) {
    throw new Error(
      'El registry de texturas está vacío: falta esperar a loadAllTextures() (<TexturesGate>)'
    )
  }
  return entry
}

/**
 * Textura del suelo: se compone **fuera de la caché** a propósito. El plano
 * lleva RepeatWrapping ×100 y el bloque de césped no, así que no deben
 * compartir instancia ni `Source`. Componer un 16×16 de más no cuesta nada.
 */
export function createGroundTexture(): CanvasTexture {
  const grass = defs.find((block) => block.name === 'grass')
  if (!grass) {
    throw new Error(
      'No hay un bloque "grass" del que sacar la textura del suelo'
    )
  }
  return createFaceTexture(composeFace(resolveFace(grass, 'top'), sprites))
}

/** Los 9 bloques con los que arranca la hotbar, en orden. */
export const initialBlockIds = defs.slice(0, 9).map((block) => block.id)
