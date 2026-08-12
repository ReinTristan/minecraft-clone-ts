# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is pnpm (v11, Node >= 24).

```bash
pnpm dev        # vite dev server, exposed on the LAN (--host)
pnpm build      # tsc (typecheck, noEmit) && vite build
pnpm biome      # biome check --write  — lint + format + organize imports
pnpm preview    # preview the production build
pnpm start      # serve dist/ as an SPA on $PORT
```

There is no test framework configured in this repo — don't invent test commands.

Biome (not ESLint/Prettier) is the only linter/formatter; `biome.json` is the source of truth for style — read it instead of guessing. `.vscode/settings.json` runs it on save with `source.fixAll.biome` and `source.organizeImports.biome`.

**Run `pnpm biome` after creating or editing any file.** Formatting differences are not editor diagnostics, so a misformatted file looks clean until someone saves it in VS Code and gets a whole-file diff.

`pnpm-workspace.yaml` sets `minimumReleaseAge: 1440` (packages must be 24h old before install) plus pinned security `overrides`. Keep both in mind when adding or bumping dependencies.

## Environment

`.env` (gitignored) holds `VITE_CURRENT_VERSION`, rendered by `src/components/UI/HUD/Info.tsx` on the main menu. `index.html` also substitutes `%VITE_DOMAIN_URL%` into the og:url meta tag. Bump `VITE_CURRENT_VERSION` alongside `package.json` `version` when releasing.

## Architecture

React 19 + `@react-three/fiber` / `drei` / `cannon` (Three.js), Tailwind v4 (via the Vite plugin, configured in `src/index.css` with `@theme`, not a tailwind.config), Zustand for state. `@/*` aliases `./src/*` — declared in **both** `vite.config.ts` and `tsconfig.app.json`/`tsconfig.json`; changing it requires editing all of them.

The app runs under `<StrictMode>`, so effects double-invoke in dev — the cannon `api.*.subscribe` calls in `Player` must keep returning their unsubscribe.

### Two stores drive everything

- `useMenuStore` — which UI layer is up (`mainMenu`, `pauseMenu`, `textureMenu`). This gates the 3D scene: `GameScene` renders the `<Canvas>` and `<Sky>` always, but only mounts `<Physics>`, `Ground`, `Player`, `Cubes`, and pointer-lock (`Fvp`) when `mainMenu` is false. `pauseMenu` also short-circuits `Player`'s `useFrame` and unmounts `PointerLockControls`.
- `useWorldStore` — the world (`cubes: ICube[]`), the current save slot, and the hotbar (`slots`, `hotBarCurrentSlot`).

Both are read as `useStore((state) => state)` throughout, i.e. components subscribe to the whole store.

### Save format

Worlds live in `localStorage`: a `totalWorlds` counter plus keys `world_1`, `world_2`, … each holding a serialized `ICube[]`. `saveWorld()` writes to `currentWorld` if set, otherwise creates `world_{totalWorlds+1}` and increments the counter. `MainMenu` enumerates worlds purely from the counter, so the counter and the `world_N` keys must stay in sync.

### Block/texture pipeline

There are **no image files**. Every texture is drawn at runtime onto a 16×16 `<canvas>` from pixel-art defined in code, so nothing here derives from Mojang assets.

- `src/types/textures.ts` — the shared vocabulary: `Face`, `FACES` (ordered `+X, -X, +Y, -Y, +Z, -Z`, i.e. `BoxGeometry`'s material-index order), `SpriteDef`, `FaceSpec`, `BlockDef`.
- `src/lib/textures/sprites.ts` — `sprites: Record<string, SpriteDef>`. Each sprite is a `palette` (char → CSS color, `'.'` reserved for transparent) plus `rows`: exactly 16 strings of exactly 16 chars.
- `src/lib/textures/render.ts` — `renderSprite` rasterizes a `SpriteDef` (validating dimensions and palette chars, throwing on violations), `composeFace` layers tint + overlays, `createFaceTexture` wraps the canvas in a `CanvasTexture` with `NearestFilter` and `SRGBColorSpace`. Uses `chroma-js` for color math.
- `src/data/blocks.ts` — `blocks`, the ordered `BlockDef[]`. Per-face specs: `faces.all` is required, any named face overrides it.
- `src/lib/textures/registry.ts` — composes everything once into a module-level `Map<number, BlockTextures>` and exposes `loadAllTextures()`, `getBlockTextures(id)`, `createGroundTexture()`, `initialBlockIds`.

Adding a block: add sprite(s) to `sprites.ts`, then an entry to `blocks.ts`. That's it.

Two invariants: **block ids are the save-format contract** (`ICube.textureId` is serialized to localStorage — never renumber), and **order matters** (`initialBlockIds` is the first 9 entries, which seeds the hotbar).

Loading is gated, not import-time: `App.tsx` wraps the tree in `<TexturesGate>`, which calls `use(loadAllTextures())` inside a `<Suspense fallback={<LoadingScreen />}>`. `loadAllTextures` memoizes the *promise object* at module level — see the long comment on it before touching that function; returning a fresh promise per call infinite-loops `use()`, and the `async` IIFE exists so a thrown `build()` memoizes its failure instead of retrying forever. `getBlockTextures` falls back to `FALLBACK_BLOCK_ID` (dirt) for unknown ids, and throws if called before the gate resolves.

Face composition is cached by `(texture, tint, overlays)`, so faces sharing a sprite share one `CanvasTexture`. `createGroundTexture()` deliberately bypasses that cache: the ground plane applies `RepeatWrapping ×100` and must not share a `Source` with the grass block.

### Input and block interaction

`useKeyboard` maps `KeyW/A/S/D`, `Space`, `Escape` to a boolean action object and `Digit1`–`Digit9` / mouse wheel directly to `setHotBarCurrentSlot`. It's called independently by `Player` and `Menus`, so each caller gets its own listener pair and its own `actions` state — the `pause` action is edge-detected in a `Menus` effect, which is why the HUD says "Double Esc to pause" (pointer lock swallows the first Escape).

Placement/removal is handled per-mesh in `Cube.tsx` and `Ground.tsx` via `onPointerDown`: `e.button === 2` (right click) places the block in `slots[hotBarCurrentSlot]`, anything else removes. `Cube` derives the neighbouring cell from `Math.floor(e.faceIndex / 2)` (12 box triangles → 6 faces) looked up in `FACE_DIRECTION_VALUES`; `Ground` uses `Math.ceil` on the intersection point. Every cube is its own `useBox` static body and rebuilds its six `MeshStandardMaterial`s on each render, which is the main scaling limit of the current design.
