import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { nitro } from 'nitro/vite'

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
    // Nitro builds the server output into the format each host actually
    // knows how to run. Without it, `vite build` still succeeds locally and
    // on Vercel's build step, but the output isn't shaped as a Vercel
    // Function — the deploy "succeeds" and then 404s/500s at runtime. No
    // preset needed for Vercel specifically; it auto-detects.
    nitro(),
    viteReact(),
  ],
})

export default config
