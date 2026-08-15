import { describe, expect, it } from 'vitest'
import { useMenuStore } from '@/store/useMenuStore'

const menu = () => useMenuStore.getState()

describe('useMenuStore', () => {
  it('starts on the main menu', () => {
    expect(menu().mainMenu).toBe(true)
    expect(menu().pauseMenu).toBe(false)
    expect(menu().textureMenu).toBe(false)
  })

  it('setMainMenu toggles the main layer', () => {
    menu().setMainMenu(false)
    expect(menu().mainMenu).toBe(false)
  })

  it('setPauseMenu toggles the pause without touching the rest', () => {
    menu().setMainMenu(false)
    menu().setPauseMenu(true)

    expect(menu().pauseMenu).toBe(true)
    expect(menu().mainMenu).toBe(false)
  })

  it('setTextureMenu toggles the texture menu', () => {
    menu().setTextureMenu(true)
    expect(menu().textureMenu).toBe(true)
  })
})
