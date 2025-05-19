import { ICube, PositionType, TextureInfo } from '@/types/cubes'
import { nanoid } from 'nanoid'
import { create } from 'zustand/react'

export interface IStore {
  cubes: ICube[]
  currentWorld: string | null
  addCube: ({
    pos,
    textureId,
  }: {
    pos: PositionType
    textureId: number
  }) => void
  removeCube: (id: string) => void
  saveWorld: (worldName?: string) => void
  resetWorld: () => void
  setWorld: (worldName?: string) => void
  getTotalWorlds: () => number
  setTotalWorlds: () => void
  slots: number[]
  setSlots: (slots: number[]) => void
  setToSlot: (slot: number, textureId: number) => void
  hotBarCurrentSlot: number
  setHotBarCurrentSlot: (slot: number) => void
}

const getLocalStorage = <T>(key: string): T | null => {
  const item = localStorage.getItem(key)
  return item ? (JSON.parse(item) as T) : null
}
const setLocalStorage = <T>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value))
}

export const useMinecraftStore = create<IStore>()((set) => ({
  cubes: [],
  currentWorld: null,
  hotBarCurrentSlot: 5,

  getTotalWorlds: () => {
    let totalWorlds = getLocalStorage<number>('totalWorlds')
    if (!totalWorlds) {
      setLocalStorage<number>('totalWorlds', 0)
      totalWorlds = 0
    }
    return totalWorlds
  },
  setTotalWorlds: () => {
    set((state) => {
      setLocalStorage<number>('totalWorlds', state.getTotalWorlds() + 1)
      return state
    })
  },
  addCube: ({ pos, textureId }) => {
    set((state) => ({
      cubes: [
        ...state.cubes,
        {
          id: nanoid(),
          textureId: textureId,
          pos,
        },
      ],
    }))
  },
  removeCube: (id) => {
    set((state) => ({
      cubes: state.cubes.filter((cube) => cube.id !== id),
    }))
  },
  saveWorld: () => {
    set((state) => {
      if (!state.currentWorld) {
        setLocalStorage<ICube[]>(
          `world_${state.getTotalWorlds() + 1}`,
          state.cubes
        )
        setLocalStorage<number>('totalWorlds', state.getTotalWorlds() + 1)
      } else setLocalStorage<ICube[]>(state.currentWorld, state.cubes)

      return state
    })
  },
  resetWorld: () => {
    set(() => ({
      cubes: [],
    }))
  },
  setWorld(worldName = '') {
    set(() => ({
      cubes: getLocalStorage<ICube[]>(worldName) ?? [],
      currentWorld: worldName || null,
    }))
  },
  slots: [],
  setSlots: (slots) => {
    set(() => ({
      slots,
    }))
  },
  setToSlot: (slot, textureId) => {
    set((state) => ({
      slots: state.slots.map((s, i) => (i === slot ? textureId : s)),
    }))
  },
  setHotBarCurrentSlot: (slot) => {
    set(() => ({
      hotBarCurrentSlot: slot,
    }))
  },
}))
