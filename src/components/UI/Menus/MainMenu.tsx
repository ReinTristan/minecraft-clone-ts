import { useMinecraftStore } from '@/hooks/useMinecraftStore'
import { useMenuStore } from '@/hooks/useMenuStore'
import { useState } from 'react'

export const MainMenu = () => {
  const { setWorld, getTotalWorlds } = useMinecraftStore((state) => state)
  const { setMainMenu } = useMenuStore((state) => state)
  const [worldSelection, setWorldSelection] = useState(false)
  return (
    <>
      <div className='absolute top-1/4 left-1/2 z-10 flex w-fit -translate-x-1/2 -translate-y-1/4 flex-col'>
        <h1 className='text-center text-8xl'>Minecraft</h1>
        <div className='mt-4 flex flex-col gap-4'>
          {!worldSelection && (
            <>
              <button
                className='cursor-pointer bg-neutral-400 p-4 text-5xl font-bold hover:bg-neutral-500'
                onClick={() => {
                  setWorld()
                  setMainMenu(false)
                }}
              >
                New World
              </button>
              <button
                className='cursor-pointer bg-neutral-400 p-4 text-5xl font-bold hover:bg-neutral-500 disabled:cursor-default disabled:bg-neutral-500'
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
                    className='cursor-pointer bg-neutral-400 p-4 text-5xl font-bold hover:bg-neutral-500 disabled:cursor-default disabled:bg-neutral-500'
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
              <button
                className='cursor-pointer bg-neutral-400 p-4 text-5xl font-bold hover:bg-neutral-500 disabled:cursor-default disabled:bg-neutral-500'
                onClick={() => setWorldSelection(false)}
              >
                Back
              </button>
            </>
          )}
        </div>
      </div>
    </>
  )
}
