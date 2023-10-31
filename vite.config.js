import { defineConfig } from 'vite'
// TODO: update to vue3
// import vue from '@vitejs/plugin-vue'
// Adaptive to vue2. 
import vue from '@vitejs/plugin-vue2'


import path from 'path'
const REPLACEMENT = `${path.resolve(__dirname, './src')}/`
export default defineConfig({
    server: {
        host: '0.0.0.0',
        https: false,
        port: 3000,
        // proxy: {
        //     '/': {
        //         target: 'http://192.168.2.55',
        //         secure: false,
        //         changeOrigin: true,
        //         ws: true,
        //     }
        // }
    },
    resolve: {
        alias: [
            { find: '@', replacement: REPLACEMENT }
            // { find: '@', replacement: './src' }
        ],
        extensions: ['.js', '.vue', '.json', '.mjs', '.ts', '.tsx']
    },
    plugins: [vue()],
})