import { useMinecraftStore } from '../hooks/useMinecraftStore'
import { Cube } from './Cube'

export const Cubes = () => {
	const [cubes] = useMinecraftStore((state) => [state.cubes])
	return cubes.map(({ id, pos, texture }) => {
		return <Cube key={id} id={id} pos={pos} texture={texture} />
	})
}
