import { useEffect, useState } from 'react'
import { useMinecraftStore } from './useMinecraftStore'

const ACTIONS_KEYBOARD_MAP = {
  Escape: 'pause',
  KeyW: 'moveForward',
  KeyS: 'moveBackward',
  KeyA: 'moveLeft',
  KeyD: 'moveRight',
  Space: 'jump',
} as const

const ACTIONS_KEYBOARD_DIGIT = {
  Digit1: 'slot0',
  Digit2: 'slot1',
  Digit3: 'slot2',
  Digit4: 'slot3',
  Digit5: 'slot4',
  Digit6: 'slot5',
  Digit7: 'slot6',
  Digit8: 'slot7',
  Digit9: 'slot8',
} as const

type actionsKey = keyof typeof ACTIONS_KEYBOARD_MAP
export const useKeyboard = () => {
  const { hotBarCurrentSlot, setHotBarCurrentSlot } = useMinecraftStore(
    (state) => state
  )
  const [actions, setActions] = useState({
    pause: false,
    moveForward: false,
    moveBackward: false,
    moveLeft: false,
    moveRight: false,
    jump: false,
  })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const { code } = e
      const action = ACTIONS_KEYBOARD_MAP[code as actionsKey]
      if (action) {
        setActions((prev) => ({ ...prev, [action]: true }))
      }
      const digitAction =
        ACTIONS_KEYBOARD_DIGIT[code as keyof typeof ACTIONS_KEYBOARD_DIGIT]
      if (digitAction) {
        const slotNumber = parseInt(digitAction.replace('slot', ''))
        setHotBarCurrentSlot(slotNumber)
      }
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      const { code } = e
      const action = ACTIONS_KEYBOARD_MAP[code as actionsKey]
      if (action) {
        setActions((prev) => ({ ...prev, [action]: false }))
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [setHotBarCurrentSlot])
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      console.log('hotBarCurrentSlot', hotBarCurrentSlot)
      if (e.deltaY < 0) {
        setHotBarCurrentSlot(
          hotBarCurrentSlot === 8 ? 0 : hotBarCurrentSlot + 1
        )
      } else {
        setHotBarCurrentSlot(
          hotBarCurrentSlot === 0 ? 8 : hotBarCurrentSlot - 1
        )
      }
    }
    document.addEventListener('wheel', handleWheel)
    return () => {
      document.removeEventListener('wheel', handleWheel)
    }
  }, [hotBarCurrentSlot, setHotBarCurrentSlot])
  return actions
}
