import { create } from "zustand";

interface IMenuStore {
    mainMenu: boolean
    pauseMenu: boolean
    textureMenu: boolean
    setMainMenu: (value: boolean) => void
    setPauseMenu: (value: boolean) => void
    setTextureMenu: (value: boolean) => void
}

export const useMenuStore = create<IMenuStore>((set) => ({
    mainMenu: true,
    pauseMenu:false,
    textureMenu: false,
    setMainMenu: (value) => {
        set(() => ({
            mainMenu: value
        }))
    },
    setPauseMenu: (value) => {
        set(() => ({
            pauseMenu: value
        }))
    },
    setTextureMenu: (value) => {
        set(() => ({
            textureMenu: value
        }))
    },
})) 