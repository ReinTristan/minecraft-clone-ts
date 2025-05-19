import { useMenuStore } from '@/hooks/useMenuStore'
import { useMinecraftStore } from '@/hooks/useMinecraftStore'

export const PauseMenu = () => {
  const { saveWorld, resetWorld } = useMinecraftStore((state) => state)
  const { setMainMenu, setPauseMenu } = useMenuStore((state) => state)
  return (
    <div className='absolute top-1/4 left-1/2 flex -translate-x-1/2 -translate-y-1/4 flex-col gap-4 rounded-lg'>
      <button
        className='bg-neutral-400 p-4 text-5xl font-bold hover:bg-neutral-500'
        onClick={() => {
          setPauseMenu(false)
        }}
      >
        Resume
      </button>
      <button
        className='bg-neutral-400 p-4 text-5xl font-bold hover:bg-neutral-500'
        onClick={() => {
          saveWorld()
          setPauseMenu(false)
        }}
      >
        Save World
      </button>
      <button
        className='bg-neutral-400 p-4 text-5xl font-bold hover:bg-neutral-500'
        onClick={() => {
          resetWorld()
          setPauseMenu(false)
        }}
      >
        Reset World
      </button>
      <button
        className='bg-neutral-400 p-4 text-5xl font-bold hover:bg-neutral-500'
        onClick={() => {
          setPauseMenu(false)
          setMainMenu(true)
          resetWorld()
        }}
      >
        Exit World
      </button>
    </div>
  )
}
