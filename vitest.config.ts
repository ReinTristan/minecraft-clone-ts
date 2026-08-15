import { playwright } from '@vitest/browser-playwright'
import { defineConfig, mergeConfig } from 'vitest/config'
// Con extensión a propósito: sin ella el `configLoader: 'native'` de Vite avisa
// de que no puede resolverlo, y va camino de ser el default.
import viteConfig from './vite.config.ts'

/**
 * Config de tests, compuesta sobre la de build en vez de mezclada con ella:
 * `vite.config.ts` se queda limpio y aquí se heredan sus plugins (react,
 * tailwind) y el alias `@/*` sin duplicarlos. Vitest coge este archivo por
 * precedencia, así que no hace falta pasar `--config`.
 *
 * Los tests corren en un chromium **de verdad** (browser mode), no en jsdom.
 * Ese es el punto: jsdom no implementa `getContext('2d')`, así que todo el
 * pipeline de texturas —que es canvas de principio a fin— sería intestable.
 * De paso salen gratis `localStorage` real y WebGL para la escena de R3F.
 */
export default mergeConfig(
  viteConfig,
  defineConfig({
    // Sin esto, Vite descubre estas dependencias a mitad del primer run, las
    // pre-bundlea y **recarga la página**, lo que tumba los tests que ya
    // estaban corriendo. Solo se nota en frío (tras `rm -rf node_modules/.vite`
    // o en un clone nuevo), que es justo cuando peor sienta.
    optimizeDeps: {
      include: [
        'react',
        'react-dom/client',
        'react/jsx-dev-runtime',
        'vitest-browser-react/pure',
        'nanoid',
        'zustand/react',
        'chroma-js',
        'three',
        '@react-three/fiber',
        '@react-three/drei',
        '@react-three/cannon',
      ],
    },
    test: {
      // Los tests viven en `test/`, fuera de `src/` y con su misma jerarquía
      // de categorías. Explicitar el patrón (el default barrería todo el repo)
      // documenta la convención y evita que un `*.test.ts` colado dentro de
      // `src/` corra sin que nadie se entere de que está en el sitio que no es.
      include: ['test/**/*.test.{ts,tsx}'],
      setupFiles: ['./test/setup.ts'],
      browser: {
        enabled: true,
        provider: playwright(),
        headless: true,
        instances: [{ browser: 'chromium' }],
      },
    },
  })
)
