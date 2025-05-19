import { useMinecraftStore } from '@/hooks/useMinecraftStore'
import { Cube } from '@/components/World/Cube'

export const Cubes = () => {
  const cubes = useMinecraftStore((state) => state.cubes)
  return cubes.map(({ id, pos, textureId }) => {
    return <Cube key={id} id={id} pos={pos} textureId={textureId} />
  })
}
