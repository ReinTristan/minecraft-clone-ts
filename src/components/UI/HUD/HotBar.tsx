import { useEffect } from 'react'
import { useMinecraftStore } from '@/hooks/useMinecraftStore'
import { useKeyboard } from '@/hooks/useKeyboard'
import * as images from '@/assets/textures/images'
export const HotBar = () => {
  const { texture, setTexture } = useMinecraftStore()
  const { dirt, glass, grass, wood, log } = useKeyboard()

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

  return (
    <div className={`texture-selector`}>
      {Object.entries(images).map(([imgKey, img]) => {
        if (imgKey === 'bedrockImg') return null
        return (
          <img
            src={img}
            alt={imgKey}
            key={imgKey}
            onClick={() => setTexture(img)}
            className={`${
              texture === imgKey.replace('Img', '') ? 'selected' : ''
            }`}
          />
        )
      })}
    </div>
  )
}
