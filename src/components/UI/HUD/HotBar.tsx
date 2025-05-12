import { useEffect, useState } from 'react'
import { useMinecraftStore } from '@/hooks/useMinecraftStore'
import { useKeyboard } from '@/hooks/useKeyboard'
import * as images from '@/assets/textures/images'
export const HotBar = () => {
  const { texture, setTexture } = useMinecraftStore()
  const { dirt, glass, grass, wood, log } = useKeyboard()
  const [activeSlot, setActiveSlot] = useState(1)
  useEffect(() => {
    const options = { dirt, glass, grass, wood, log }
    const selectedTexture = Object.entries(options).find(
      ([, isEnabled]) => isEnabled
    )
    if (selectedTexture) {
      const [textureName] = selectedTexture
      setTexture(textureName)
    }
  }, [dirt, glass, grass, wood, log])
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY < 0) {
        setActiveSlot((prev) => (prev === 9 ? 1 : prev + 1))
      } else {
        setActiveSlot((prev) => (prev === 1 ? 9 : prev - 1))
      }
    }
    window.addEventListener('wheel', handleWheel)
    return () => {
      window.removeEventListener('wheel', handleWheel)
    }
  }, [])
  const slots = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  return (
    <div className='absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 border-2 border-black bg-black/50 shadow-md'>
      {slots.map((slot) => (
        <div
          key={slot}
          className={`relative flex size-16 items-center justify-center bg-transparent ${activeSlot === slot ? 'border-[6px] border-white/70' : 'border-4 border-neutral-500'}`}
        >
          <span className='absolute top-1 right-1 text-xs text-neutral-400'>
            {slot}
          </span>
          <div className='size-1/2 object-contain'>
            <img
              src={images.dirtImg}
              alt={`slot${slot}`}
              onClick={() => setTexture(images.dirtImg)}
              className='size-full'
            />
          </div>
        </div>
      ))}
    </div>
  )
}
