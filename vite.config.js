import { defineConfig } from "vite"
import laravel from "laravel-vite-plugin"
import react from "@vitejs/plugin-react"
import svgr from "vite-plugin-svgr"

const host = "https://crm-aimigroup.test"
export default defineConfig({
  plugins: [
    laravel(["resources/css/app.css", "resources/js/app.js"]),
    svgr(),
    react(),
  ],
})
