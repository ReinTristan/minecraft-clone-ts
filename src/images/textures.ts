import { grassImg, dirtImg, logImg, glassImg, woodImg } from './images'

import { NearestFilter, RepeatWrapping, TextureLoader } from 'three'

const groundTexture = new TextureLoader().load(grassImg)
const grassTexture = new TextureLoader().load(grassImg)
const dirtTexture = new TextureLoader().load(dirtImg)
const logTexture = new TextureLoader().load(logImg)
const glassTexture = new TextureLoader().load(glassImg)
const woodTexture = new TextureLoader().load(woodImg)

const texturesObj = {
	groundTexture,
	grassTexture,
	dirtTexture,
	logTexture,
	glassTexture,
	woodTexture,
}

const textureArr = Object.values(texturesObj)
for (const texture of textureArr) {
	texture.magFilter = NearestFilter
}
groundTexture.wrapS = RepeatWrapping
groundTexture.wrapT = RepeatWrapping

export { groundTexture, texturesObj }
