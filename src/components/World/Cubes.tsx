import { Cube } from '@/components/World/Cube'
import { useMinecraftStore } from '@/hooks/useMinecraftStore'

export const Cubes = () => {
  const cubes = useMinecraftStore((state) => state.cubes)
  return cubes.map(({ id, pos, textureId }) => {
    return <Cube key={id} id={id} pos={pos} textureId={textureId} />
  })
}
