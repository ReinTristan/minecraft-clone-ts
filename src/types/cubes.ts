// Formato de guardado: esto es lo que se serializa en localStorage, así que
// cambiarlo rompe los mundos ya guardados. Los tipos del sistema de texturas
// viven en @/lib/textures/types.

export interface ICube {
  id: string
  pos: PositionType
  textureId: number
}

export type PositionType = [x: number, y: number, z: number]
