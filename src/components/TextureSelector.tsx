import { useEffect } from 'react'
import { useMinecraftStore } from '../hooks/useMinecraftStore'
import { useKeyboard } from '../hooks/useKeyboard'
import * as images from '../images/images'
export const TextureSelector = () => {
	const { texture, setTexture } = useMinecraftStore()
	const { dirt, glass, grass, wood, log } = useKeyboard()

	useEffect(() => {
		const options = { dirt, glass, grass, wood, log }
		const selectedTexture = Object.entries(options).find(
			([texture, isEnabled]) => isEnabled
		)
		if (selectedTexture) {
			const [textureName] = selectedTexture
            console.log(textureName)
			setTexture(textureName)
		}
	}, [dirt, glass, grass, wood, log])


	return (
		<div className={`texture-selector`}>
			{Object.entries(images).map(([imgKey, img]) => {
				return (

					<img
						src={img}
						alt={imgKey}
						key={imgKey}
						onClick={() => setTexture(img)}
                        className={`${texture === imgKey.replace('Img', '') ? 'selected': ''}`}
                    />
				)
			})}
		</div>
	)
}
