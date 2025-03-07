import type { NextConfig } from "next"

import { createRequire } from "node:module"

const require = createRequire(import.meta.url)
require("./src/env/client.ts")

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // z: Configure remote image sources
    remotePatterns: [
      {
        // ! Allow images from any HTTPS source
        protocol: "https",
        hostname: "**"
      },
      {
        // ! Allow images from any HTTP source
        protocol: "http",
        hostname: "**"
      }
    ]
  },
  compiler: {
    // Remove console.log in production
    // eslint-disable-next-line n/no-process-env
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false
  }
}

export default nextConfig
