
/* IMPORT */

import path from 'node:path'
import { defineConfig } from 'vite'
import voby from 'voby-vite'

/* MAIN */

const config = defineConfig({
  plugins: [
    voby()
  ],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, '../../../voby/src'),
      voby: process.argv.includes('dev') ? path.resolve(__dirname, '../../../voby/src') : 'voby'
    }
  }
})

/* EXPORT */

export default config
