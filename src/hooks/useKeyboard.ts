import { useEffect, useState } from "react"

const ACTIONS_KEYBOARD_MAP = {
    KeyW: 'moveForward',
    KeyS: 'moveBackward',
    KeyA: 'moveLeft',
    KeyD: 'moveRight',
    Space: 'jump',
    Digit1: 'dirt',
    Digit2: 'glass',
    Digit3: 'grass',
    Digit4: 'log',
    Digit5: 'wood',

} as const

type actionsKey = keyof typeof ACTIONS_KEYBOARD_MAP
export const useKeyboard = () => {
    const [actions, setActions] = useState({
        moveForward: false,
        moveBackward: false,
        moveLeft: false,
        moveRight: false,
        jump: false,
        dirt: false,
        grass: false,
        log: false,
        glass: false,
        wood: false,
    })
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const { code } = e
            const action = ACTIONS_KEYBOARD_MAP[code as actionsKey]
            if(action) {
                setActions(prev => ({...prev, [action]: true}))
            }
        }
        const handleKeyUp = (e: KeyboardEvent) => {
            const { code } = e
            const action = ACTIONS_KEYBOARD_MAP[code as actionsKey]
            if(action) {
                setActions(prev => ({...prev, [action]: false}))
            }
        }
        document.addEventListener('keydown', handleKeyDown)
        document.addEventListener('keyup', handleKeyUp)
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.removeEventListener('keyup', handleKeyUp)
        }
    }, [])
    return actions
}