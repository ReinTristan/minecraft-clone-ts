import { useMinecraftStore } from '@/hooks/useMinecraftStore'
import { useMenuStore } from '@/hooks/useMenuStore'
import { useState } from 'react'
import { useAgent } from '@/hooks/useAgent'

export const MainMenu = () => {
  const { setWorld, getTotalWorlds } = useMinecraftStore()
  const { setMainMenu } = useMenuStore()
  const [worldSelection, setWorldSelection] = useState(false)
  const { browser } = useAgent()
  if (browser !== 'Chrome') {
    return (
      <>
        <div className='main-menu'>
          <h1>Minecraft</h1>
          <span className='menu-text'>
            Unfortunately your browser is not supported at the moment
          </span>
        </div>
      </>
    )
  }
  return (
    <>
      <div className='main-menu'>
        <h1>Minecraft</h1>
        <div className='main-menu-buttons'>
          {!worldSelection && (
            <>
              <button
                onClick={() => {
                  setWorld()
                  setMainMenu(false)
                }}
              >
                New World
              </button>
              <button
                disabled={getTotalWorlds() <= 0}
                onClick={() => setWorldSelection(true)}
              >
                Load World
              </button>
            </>
          )}

          {worldSelection && (
            <>
              {Array(getTotalWorlds())
                .fill(0)
                .map((_, index) => (
                  <button
                    key={index}
                    disabled={getTotalWorlds() <= 0}
                    onClick={() => {
                      setWorld(`world_${index + 1}`)
                      setMainMenu(false)
                    }}
                  >
                    World {index + 1}
                  </button>
                ))}
              <button onClick={() => setWorldSelection(false)}>Back</button>
            </>
          )}
        </div>
      </div>
    </>
  )
}
