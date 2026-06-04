import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import svgr from '@svgr/rollup'

export default defineConfig({
    plugins: [react(), svgr()],
    server: {
        proxy: {
            '/api': 'http://localhost:5090',
            '/images': 'http://localhost:5090'
        }
    }
})
