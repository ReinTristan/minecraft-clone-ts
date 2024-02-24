import { Physics } from '@react-three/cannon'
import { Sky } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Ground } from './Ground'
import { Fvp } from './FVP'
import { Player } from './Player'
import { Cubes } from './Cubes'
import { useMenuStore } from '../hooks/useMenuStore'

export function GameScene() {
	const { mainMenu, pauseMenu } = useMenuStore()

	return (
		<>
			<Canvas>
				<Sky sunPosition={[100, 100, 20]} />
				{!mainMenu && (
					<>
						<ambientLight intensity={1} />
						<Fvp />
						<Physics>
							<Ground />
							<Player />
							<Cubes />
						</Physics>
					</>
				)}
			</Canvas>
			{!mainMenu && !pauseMenu && <div className='pointer'>+</div>}
		</>
	)
}
