import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import stylex from '@stylexjs/unplugin'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    stylex.vite({
      useCSSLayers: true,
      dev: process.env.NODE_ENV === 'development',
    }),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
