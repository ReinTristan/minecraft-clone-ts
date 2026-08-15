import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react/pure'
import { PauseMenu } from '@/components/UI/Menus/PauseMenu'
import { useMenuStore } from '@/store/useMenuStore'
import { useWorldStore } from '@/store/useWorldStore'

const world = () => useWorldStore.getState()
const menu = () => useMenuStore.getState()

const savedWorldKeys = () =>
  Object.keys(localStorage)
    .filter((key) => key.startsWith('world_'))
    .sort()

/** Estado de partida: dentro de un mundo nuevo, con la pausa abierta. */
const inGame = () => {
  useMenuStore.setState({ mainMenu: false, pauseMenu: true })
  world().addCube({ pos: [0, 0, 0], textureId: 1 })
}

describe('Save World', () => {
  /**
   * El bug del doble guardado, en el sitio donde se reprodujo: dos pulsaciones
   * seguidas de "Save World" creaban `world_1` **y** `world_2`, porque
   * `saveWorld` nunca fijaba `currentWorld` y la segunda volvía a entrar por la
   * rama de "mundo nuevo".
   */
  it('still leaves a single world after two clicks', async () => {
    inGame()
    const screen = await render(<PauseMenu />)
    const save = screen.getByRole('button', { name: 'Save World' })

    await save.click()
    await save.click()

    expect(savedWorldKeys()).toEqual(['world_1'])
    expect(world().totalWorlds).toBe(1)
    expect(world().currentWorld).toBe('world_1')
  })

  it('saves the cubes and closes the pause menu', async () => {
    inGame()
    const screen = await render(<PauseMenu />)

    await screen.getByRole('button', { name: 'Save World' }).click()

    expect(JSON.parse(localStorage.getItem('world_1') as string)).toHaveLength(
      1
    )
    expect(menu().pauseMenu).toBe(false)
  })
})

describe('the other buttons', () => {
  it('Resume only closes the pause menu', async () => {
    inGame()
    const screen = await render(<PauseMenu />)

    await screen.getByRole('button', { name: 'Resume' }).click()

    expect(menu().pauseMenu).toBe(false)
    expect(menu().mainMenu).toBe(false)
    expect(world().cubes).toHaveLength(1)
  })

  it('Reset World empties the world and closes the pause menu', async () => {
    inGame()
    const screen = await render(<PauseMenu />)

    await screen.getByRole('button', { name: 'Reset World' }).click()

    expect(world().cubes).toEqual([])
    expect(menu().pauseMenu).toBe(false)
  })

  it('Exit World goes back to the main menu with an empty world', async () => {
    inGame()
    const screen = await render(<PauseMenu />)

    await screen.getByRole('button', { name: 'Exit World' }).click()

    expect(menu().mainMenu).toBe(true)
    expect(menu().pauseMenu).toBe(false)
    expect(world().cubes).toEqual([])
  })
})
