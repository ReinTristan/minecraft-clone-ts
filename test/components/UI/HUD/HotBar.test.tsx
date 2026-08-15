import { beforeAll, describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react/pure'
import { HotBar } from '@/components/UI/HUD/HotBar'
import { initialBlockIds, loadAllTextures } from '@/lib/textures/registry'
import { useWorldStore } from '@/store/useWorldStore'

// Sin mocks: en browser mode hay canvas de verdad, así que la hotbar consume el
// registry real y los iconos son los `toDataURL` que se ven en el juego.
beforeAll(async () => {
  await loadAllTextures()
})

describe('HotBar', () => {
  it('renders the 9 numbered slots', async () => {
    const screen = await render(<HotBar />)

    for (let pos = 1; pos <= 9; pos++) {
      await expect.element(screen.getByText(String(pos))).toBeVisible()
    }
  })

  it('seeds the slots with the initial blocks on mount', async () => {
    await render(<HotBar />)

    expect(useWorldStore.getState().slots).toEqual(initialBlockIds)
  })

  it('shows the real icon of its block on every slot', async () => {
    const screen = await render(<HotBar />)

    const icon = screen.getByAltText('slot1')
    await expect.element(icon).toBeVisible()
    expect(icon.element().getAttribute('src')).toMatch(
      /^data:image\/png;base64,/
    )
  })

  it('gives different blocks different icons', async () => {
    const screen = await render(<HotBar />)

    const src = (n: number) =>
      screen.getByAltText(`slot${n}`).element().getAttribute('src')
    expect(src(1)).not.toBe(src(2))
  })

  // El recuadro blanco no tiene rol accesible, así que se localiza por su clase.
  it('follows hotBarCurrentSlot with the selection highlight', async () => {
    useWorldStore.setState({ hotBarCurrentSlot: 3 })
    const screen = await render(<HotBar />)

    const slots = screen.container.querySelectorAll('.size-16')
    const highlights = screen.container.querySelectorAll('.border-white')

    expect(slots).toHaveLength(9)
    expect(highlights).toHaveLength(1)
    expect(slots[3].contains(highlights[0])).toBe(true)
  })
})
