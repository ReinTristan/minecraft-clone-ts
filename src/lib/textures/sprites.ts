import type { SpriteDef } from '@/lib/textures/types'

// Pixel art propio (16×16): paletas y motivos originales, sin imitar
// el arte de Mojang. Editable a mano: cada char mapea a la paleta,
// '.' = transparente.

const dirt: SpriteDef = {
  palette: {
    a: '#9a5b3f',
    b: '#84492f',
    c: '#6f3a26',
    d: '#ac6f4e',
  },
  rows: [
    'aabaacadaabbacaa',
    'baacabaacaadaaba',
    'acaadaabbaacaaab',
    'aabcaaacaabaadaa',
    'daabaadaacabaaca',
    'aacaabaaabdaabaa',
    'abaadacaabaacaad',
    'aadaabaacaadbaaa',
    'caabaacabaabaaca',
    'aabaadaabaacaaba',
    'adaacaabaadaacab',
    'aabaabacaabaabaa',
    'acaadaabaacdaaba',
    'baacaabaadaabaac',
    'aadaabacaabaacaa',
    'abaacaadaacabada',
  ],
}

const stone: SpriteDef = {
  palette: {
    a: '#7d8794',
    b: '#6b7581',
    c: '#5a636f',
    d: '#8f99a6',
  },
  rows: [
    'aaadaaabaaadaaaa',
    'aabaaadaaabaaada',
    'daaacaaaadaaabaa',
    'aaabaaadaaacaaad',
    'abaaadaaabaaadaa',
    'aaadaabaaadaaaba',
    'acaaabaaacaaabad',
    'aaabaaacaaabaaaa',
    'adaaabaaadaaacaa',
    'aaacaaabaaadaaab',
    'abaaadaaacaaabaa',
    'aaadaaabaaabaaad',
    'acaaabaaadaaacaa',
    'aaabaaadaaacaaba',
    'adaaacaaabaaadaa',
    'aaabaaadaaadaaba',
  ],
}

const glass: SpriteDef = {
  palette: {
    g: '#9fc9d9',
    h: '#dff2f7',
  },
  rows: [
    'gggggggggggggggg',
    'g..............g',
    'g.h............g',
    'g..h...........g',
    'g...h..........g',
    'g..............g',
    'g......h.......g',
    'g.......h......g',
    'g........h.....g',
    'g..............g',
    'g..........h...g',
    'g...........h..g',
    'g..............g',
    'g..............g',
    'g..............g',
    'gggggggggggggggg',
  ],
}

export const sprites: Record<string, SpriteDef> = {
  dirt,
  glass,
  stone,
}
