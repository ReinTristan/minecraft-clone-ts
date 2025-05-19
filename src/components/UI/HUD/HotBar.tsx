import { initialTexturesIds, texturesData, texturesLoaded } from '@/lib/utils'
import { useMinecraftStore } from '@/hooks/useMinecraftStore'
import { useEffect } from 'react'
export const HotBar = () => {
  const { slots, setSlots, hotBarCurrentSlot, setHotBarCurrentSlot } =
    useMinecraftStore((state) => state)
  const slotsPositions = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  useEffect(() => {
    setSlots([...initialTexturesIds])
  }, [])

  return (
    <div className='absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 border-2 border-black bg-black/50 shadow-md'>
      {slotsPositions.map((pos) => (
        <div
          key={pos}
          className={`relative flex size-16 items-center justify-center border-4 border-neutral-500 bg-transparent`}
        >
          <span className='absolute top-1 right-1 text-xs text-neutral-400'>
            {pos}
          </span>
          <div className='size-1/2 object-contain'>
            {slots[pos - 1] && (
              <img
                src={`${
                  texturesLoaded.get(
                    texturesData.get(slots[pos - 1])?.textures.top ?? 'dirt'
                  )?.image.src
                }`}
                alt={`slot${pos}`}
                className='size-full'
              />
            )}
          </div>
          {pos === hotBarCurrentSlot + 1 && (
            <div className='absolute inset-0 border-2 border-white' />
          )}
        </div>
      ))}
    </div>
  )
}
