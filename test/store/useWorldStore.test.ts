import { describe, expect, it } from 'vitest'
import {
  readTotalWorlds,
  TOTAL_WORLDS_KEY,
  useWorldStore,
  worldKey,
} from '@/store/useWorldStore'
import { ICube } from '@/types/cubes'

const world = () => useWorldStore.getState()

const cube = (pos: [number, number, number], textureId = 1): ICube => ({
  id: `id-${pos.join('-')}`,
  pos,
  textureId,
})

/** Claves `world_N` presentes en localStorage, ordenadas. */
const savedWorldKeys = () =>
  Object.keys(localStorage)
    .filter((key) => key.startsWith('world_'))
    .sort()

describe('cubes', () => {
  it('addCube adds a cube with its own id', () => {
    world().addCube({ pos: [0, 0, 0], textureId: 3 })
    world().addCube({ pos: [1, 0, 0], textureId: 4 })

    expect(world().cubes).toHaveLength(2)
    expect(world().cubes[0].textureId).toBe(3)
    expect(world().cubes[0].id).not.toBe(world().cubes[1].id)
  })

  it('removeCube removes only the given id', () => {
    world().addCube({ pos: [0, 0, 0], textureId: 1 })
    world().addCube({ pos: [1, 0, 0], textureId: 2 })
    const [first] = world().cubes

    world().removeCube(first.id)

    expect(world().cubes).toHaveLength(1)
    expect(world().cubes[0].textureId).toBe(2)
  })

  it('resetWorld empties the cubes', () => {
    world().addCube({ pos: [0, 0, 0], textureId: 1 })
    world().resetWorld()
    expect(world().cubes).toEqual([])
  })
})

describe('totalWorlds', () => {
  // O3: el getter viejo escribía la clave cuando no existía, y se llamaba en
  // pleno render de MainMenu.
  it('reads 0 without the key and does not create it', () => {
    expect(readTotalWorlds()).toBe(0)
    expect(localStorage.getItem(TOTAL_WORLDS_KEY)).toBeNull()
  })

  it('reads the existing counter', () => {
    localStorage.setItem(TOTAL_WORLDS_KEY, '4')
    expect(readTotalWorlds()).toBe(4)
  })
})

describe('saveWorld', () => {
  /**
   * El bug: `saveWorld` incrementaba el contador pero nunca fijaba
   * `currentWorld`, así que la segunda pulsación de "Save World" volvía a
   * entrar por la rama de "mundo nuevo" y creaba `world_2`.
   */
  it('saving a new world twice leaves a single world_1', () => {
    world().addCube({ pos: [0, 0, 0], textureId: 1 })
    world().saveWorld()
    world().addCube({ pos: [1, 0, 0], textureId: 2 })
    world().saveWorld()

    expect(savedWorldKeys()).toEqual(['world_1'])
    expect(world().totalWorlds).toBe(1)
    expect(world().currentWorld).toBe('world_1')
  })

  it('overwrites with the current state on the second save', () => {
    world().addCube({ pos: [0, 0, 0], textureId: 1 })
    world().saveWorld()
    world().addCube({ pos: [1, 0, 0], textureId: 2 })
    world().saveWorld()

    const saved = JSON.parse(
      localStorage.getItem('world_1') as string
    ) as ICube[]
    expect(saved).toHaveLength(2)
  })

  it('does not bump the counter when saving over a loaded world', () => {
    localStorage.setItem(TOTAL_WORLDS_KEY, '2')
    localStorage.setItem('world_2', JSON.stringify([cube([0, 0, 0])]))
    useWorldStore.setState({ totalWorlds: 2 })

    world().setWorld('world_2')
    world().addCube({ pos: [5, 5, 5], textureId: 9 })
    world().saveWorld()

    expect(world().totalWorlds).toBe(2)
    expect(localStorage.getItem(TOTAL_WORLDS_KEY)).toBe('2')
    expect(savedWorldKeys()).toEqual(['world_2'])
  })

  it('saves the second new world as world_2', () => {
    world().saveWorld()
    // "Exit World" vuelve al menú; el mundo siguiente arranca de cero
    world().setWorld()
    world().saveWorld()

    expect(savedWorldKeys()).toEqual(['world_1', 'world_2'])
    expect(world().totalWorlds).toBe(2)
  })
})

describe('setWorld', () => {
  it('loads the cubes of the given key', () => {
    localStorage.setItem(
      'world_1',
      JSON.stringify([cube([1, 2, 3], 5), cube([4, 5, 6], 6)])
    )

    world().setWorld('world_1')

    expect(world().cubes).toHaveLength(2)
    expect(world().cubes[0].textureId).toBe(5)
    expect(world().currentWorld).toBe('world_1')
  })

  it('starts a new empty world with no argument', () => {
    useWorldStore.setState({
      cubes: [cube([0, 0, 0])],
      currentWorld: 'world_1',
    })

    world().setWorld()

    expect(world().cubes).toEqual([])
    expect(world().currentWorld).toBeNull()
  })

  it('leaves the world empty on a missing key, without throwing', () => {
    expect(() => world().setWorld('world_99')).not.toThrow()
    expect(world().cubes).toEqual([])
  })

  it('does not break the menu on a key with corrupt JSON', () => {
    localStorage.setItem('world_1', '{not json')

    expect(() => world().setWorld('world_1')).not.toThrow()
    expect(world().cubes).toEqual([])
  })
})

describe('hotbar', () => {
  it('setSlots replaces the slots', () => {
    world().setSlots([1, 2, 3])
    expect(world().slots).toEqual([1, 2, 3])
  })

  it('setToSlot changes only the given index', () => {
    world().setSlots([1, 2, 3])
    world().setToSlot(1, 9)
    expect(world().slots).toEqual([1, 9, 3])
  })

  it('setHotBarCurrentSlot sets the active slot', () => {
    world().setHotBarCurrentSlot(4)
    expect(world().hotBarCurrentSlot).toBe(4)
  })
})

describe('worldKey', () => {
  it('keeps the key shape of the save format', () => {
    expect(worldKey(1)).toBe('world_1')
    expect(worldKey(12)).toBe('world_12')
  })
})
