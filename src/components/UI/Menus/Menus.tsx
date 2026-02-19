import { useEffect } from 'react'
import { MainMenu } from '@/components/UI/Menus/MainMenu'
import { PauseMenu } from '@/components/UI/Menus/PauseMenu'
import { useKeyboard } from '@/hooks/useKeyboard'
import { useMenuStore } from '@/hooks/useMenuStore'
import { HotBar } from '../HUD/HotBar'
export function Menus() {
	const { mainMenu, pauseMenu, setPauseMenu } = useMenuStore((state) => state)
	const { pause } = useKeyboard()
	useEffect(() => {
		if (pause) {
			setPauseMenu(!pauseMenu)
		}
	}, [pause, setPauseMenu])

	return (
		<>
			{!mainMenu && (
				<>
					<span className='absolute top-8 left-8 font-bold text-5xl'>
						Double Esc to pause
					</span>
					<HotBar />
					{pauseMenu && <PauseMenu />}
				</>
			)}
			{mainMenu && <MainMenu />}
		</>
	)
}
