/**
 * Fallback del <Suspense> mientras el registry compone las texturas.
 *
 * Hoy dura un parpadeo: generar 9 bloques de 16×16 es instantáneo. Está aquí
 * por la arquitectura — cuando en 0.7.0 haya chunks y muchos más bloques, la
 * espera será real y esta pantalla ya estará en su sitio.
 */
export const LoadingScreen = () => (
  <div className='fixed top-0 left-0 flex h-full w-full select-none flex-col items-center justify-center gap-6 bg-gray-950 font-mc text-neutral-300'>
    <p className='text-xl'>Loading textures…</p>
    <div className='h-2 w-64 overflow-hidden border-2 border-neutral-700'>
      <div className='h-full w-1/3 animate-pulse bg-neutral-500' />
    </div>
  </div>
)
