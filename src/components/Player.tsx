import { useSphere } from '@react-three/cannon'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { Euler, MathUtils, Mesh, Vector3 } from 'three'
import { useKeyboard } from '../hooks/useKeyboard'
import { texturesObj } from '../images/textures'

const CHARACTER_SPEED = 5
const CHARACTER_JUMP_FORCE = 5
export const Player = () => {


    const {moveForward, moveBackward, moveLeft, moveRight, jump} = useKeyboard()

    const {camera} = useThree()
    const [ref, api] = useSphere<Mesh>(() => ({
        mass: 1,
        type: 'Dynamic',
        args: [0.4],
        position: [0, 0.5, 0],
    }))


    const pos = useRef([0,0,0])
    useEffect(() => {
        api.position.subscribe(p => {
            pos.current = p
        })
    }, [api.position])

    const vel = useRef([0,0,0])
    
    useEffect(() => {
        api.velocity.subscribe(v => {
            vel.current = v
        })
    }, [api.velocity])

    const rot = useRef([0,0,0])
    
    useEffect(() => {
        api.rotation.subscribe(r => {
            rot.current = r
        })
    }, [api.rotation])

    useFrame(() => {
        camera.position.copy(new Vector3(pos.current[0], pos.current[1]+1, pos.current[2]))

        let appliedRotation = camera.rotation
        const direction = new Vector3()
        const frontVector = new Vector3(0,0, (moveBackward ? 1 : 0) - (moveForward ? 1: 0))
        const sideVector = new Vector3( (moveLeft ? 1 : 0) - (moveRight ? 1: 0), 0, 0)
        const rotationXDeg = Math.floor(MathUtils.radToDeg(camera.rotation.x))
        if(Math.abs(rotationXDeg) <= 105 && Math.abs(rotationXDeg) >= 75 ) {
            appliedRotation = new Euler(0, camera.rotation.y, 0, Euler.DEFAULT_ORDER)


        }
        direction
            .subVectors(frontVector, sideVector)
            .normalize()
            .multiplyScalar(CHARACTER_SPEED)
            .applyEuler(appliedRotation)

        api.velocity.set(direction.x, vel.current[1], direction.z)
        api.rotation.set(camera.rotation.x, camera.rotation.y,camera.rotation.z)
        if(jump && Math.abs(vel.current[1]) < 0.05) {
            api.velocity.set(vel.current[0], CHARACTER_JUMP_FORCE ,vel.current[2])

        }
    })

  return (
    <mesh ref={ref}>
    <sphereGeometry args={[0.4]} />
    <meshStandardMaterial map={texturesObj['test1']}/>
    </mesh>
  )
}
