import { nanoid } from 'nanoid'
import { create } from 'zustand/react'

export interface ICube {
	id: string
	pos: [number, number, number]
	texture: string
}

export interface IStore {
	texture: string
	cubes: ICube[]
	currentWorld: string | null
	addCube: (x: number, y: number, z: number) => void
	removeCube: (id: string) => void
	setTexture: (name: string) => void
	saveWorld: (worldName?: string) => void
	resetWorld: () => void
	setWorld: (worldName?: string) => void
	getTotalWorlds: () => number
	setTotalWorlds: () => void
}

const getLocalStorage = <T>(key: string): T | null => {
	const item = localStorage.getItem(key)
	return item ? (JSON.parse(item) as T) : null
}
const setLocalStorage = <T>(key: string, value: T) => {
	localStorage.setItem(key, JSON.stringify(value))
}

export const useMinecraftStore = create<IStore>()((set) => ({
	texture: 'dirt',
	cubes: [],
	currentWorld: null,
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
	addCube: (x, y, z) => {
		set((state) => ({
			cubes: [
				...state.cubes,
				{
					id: nanoid(),
					texture: state.texture,
					pos: [x, y, z],
				},
			],
		}))
	},
	removeCube: (id) => {
		set((state) => ({
			cubes: state.cubes.filter((cube) => cube.id !== id),
		}))
	},
	setTexture: (texture) => {
		set(() => ({ texture }))
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
}))
