import { useMenuStore } from '../hooks/useMenuStore'
import { useMinecraftStore } from '../hooks/useMinecraftStore'

export const PauseMenu = () => {
	const { saveWorld, resetWorld } = useMinecraftStore()
	const { setMainMenu, setPauseMenu } = useMenuStore()
	return (
		<div className='pause-menu'>
						<button
				onClick={() => {
					setPauseMenu(false)
				}}
			>Resume</button>
			<button
				onClick={() => {
					saveWorld()
					setPauseMenu(false)
				}}
			>
				Save World
			</button>
			<button
				onClick={() => {
					resetWorld()
					setPauseMenu(false)
				}}
			>
				Reset World
			</button>
			<button
				onClick={() => {
					setPauseMenu(false)
					setMainMenu(true)
					resetWorld()
				}}
			>
				Exit World
			</button>
		</div>
	)
}
