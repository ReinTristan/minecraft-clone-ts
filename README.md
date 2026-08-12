# MC-Clone

MC-Clone is a simple voxel sandbox — a Minecraft-inspired learning project built with TypeScript and Three.js — based on [Midudev's](https://github.com/midudev) video on [YouTube](https://www.youtube.com/watch?v=dm7nfe3bOE4) from the original [freecodecamp's tutorial](https://www.freecodecamp.org/news/code-a-minecraft-clone-using-react-and-three-js/).

## Improvements

- Added TypeScript support
- TailwindCSS for styling
- Added multi-textures blocks
- More blocks
- Block Selection with Hotbar
- Block breaking and placing
- Multi World saving and loading using local storage
- Original textures generated at runtime — no image assets in the repo
- Async texture pipeline with a loading gate (`use()` + Suspense)
- Improved performance and optimization
- Inventory (Comming soon)


## Getting started

Requires Node >= 24 and pnpm.

```bash
pnpm install
pnpm dev      # dev server, exposed on the LAN
pnpm build    # typecheck + production build
```

## Sources

- Original project by [freeCodeCamp](https://github.com/danba340/minecraft-freecodecamp)
- Followed Tutorial from [Midudev](https://github.com/midudev/minecraft-clone)
- Minecraft-Like font from [dafont.com](https://www.dafont.com/es/minecraft.font) by [Craftron Gaming](https://www.dafont.com/es/craftron-gaming.d6128)

---

Not affiliated with Minecraft, Mojang AB or Microsoft. This is a learning
project: all textures are original artwork generated at runtime, and no
Minecraft assets are redistributed in this repository.
