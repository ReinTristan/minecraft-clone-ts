import { Cube } from '@/components/World/Cube'
import { useWorldStore } from '@/store/useWorldStore'

export const Cubes = () => {
  const cubes = useWorldStore((state) => state.cubes)
  return cubes.map(({ id, pos, textureId }) => {
    return <Cube key={id} id={id} pos={pos} textureId={textureId} />
  })
}
