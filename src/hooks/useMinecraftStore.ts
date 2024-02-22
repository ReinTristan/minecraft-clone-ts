import { nanoid } from "nanoid";
import { create } from "zustand";


export interface ICube {
id: string
pos: [number, number, number]
texture: string
}

export interface IStore {
    texture: string,
    cubes: ICube[],
    addCube: (x: number, y: number, z: number) => void,
    removeCube: (id: string) => void,
    setTexture: (name: string) => void
    saveWorld: () => void,
    resetWorld: () => void,
}

const getLocalStorage = (key: string) => JSON.parse(localStorage.getItem(key) ?? '[]')
const setLocalStorage = (key: string, value: unknown) =>{ localStorage.setItem(key, JSON.stringify(value))}


export const useMinecraftStore = create<IStore>((set) =>  ({
    texture: 'dirt',
    cubes: getLocalStorage('cubes') || [],
    addCube: (x,y,z) => {
        console.log({x,y,z})
        set(state => ({
            cubes: [...state.cubes, {
                id: nanoid(),
                texture: state.texture,
                pos: [x, y, z]
            }]
        }))
    },
    removeCube: (id) => {
        set(state => ({
            cubes: state.cubes.filter(cube => cube.id !== id)
        }))
    },
    setTexture: (texture) => {
        set(() => ({texture}))
    },
    saveWorld: () => {
        set(state => {
            setLocalStorage('cubes', state.cubes)
            return state
        })
    },
    resetWorld: () => {
        set(() => ({
            cubes: []
        }))
    }
}))