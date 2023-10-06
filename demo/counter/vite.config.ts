
/* IMPORT */

import path from 'node:path'
import process from 'node:process'
import { defineConfig } from 'vite'

/* MAIN */

const config = defineConfig({
    resolve: {
        alias: {
            '~': path.resolve('../../src'),
            'voby/jsx-dev-runtime': process.argv.includes('dev') ? path.resolve('../../../woby/src/jsx/runtime') : 'voby/jsx-dev-runtime',
            'voby/jsx-runtime': process.argv.includes('dev') ? path.resolve('../../../woby/src/jsx/runtime') : 'voby/jsx-runtime',
            'voby': process.argv.includes('dev') ? path.resolve('../../../woby/src') : 'voby'
        }
    }
})

/* EXPORT */

export default config
