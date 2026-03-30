import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"
import { dreamfloorLocalApiPlugin } from "./vite-plugin-local-api"

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const loadedEnvironment = loadEnv(mode, process.cwd(), "")
  for (const [environmentKey, environmentValue] of Object.entries(loadedEnvironment)) {
    if (process.env[environmentKey] === undefined) {
      process.env[environmentKey] = environmentValue
    }
  }

  return {
    plugins: [dreamfloorLocalApiPlugin(), react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  }
})