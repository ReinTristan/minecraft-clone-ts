import { useMinecraftStore } from '../hooks/useMinecraftStore'

export const Menu = () => {
    const {saveWorld, resetWorld} = useMinecraftStore()
  return (
    <div className='menu'>
        <button onClick={() => saveWorld()}>Save World</button>
        <button onClick={() => resetWorld()}>Reset World</button>
    </div>
  )
}
