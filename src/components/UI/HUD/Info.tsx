const version = import.meta.env.VITE_CURRENT_VERSION
export function Info() {
  return (
    <div>
      <span className='absolute top-8 right-8 text-5xl font-bold'>
        Version {version}
      </span>
      <span className='absolute right-8 bottom-8 text-2xl font-bold'>
        Not affiliated with Minecraft / Mojang AB / Microsoft.
      </span>
      <span className='absolute bottom-8 left-8 text-2xl font-bold'>
        Made by{' '}
        <a
          href='https://github.com/reintristan/minecraft-clone-ts'
          target='_blank'
          rel='noopener noreferrer'
          className=''
        >
          ReinTristan
        </a>
      </span>
    </div>
  )
}
