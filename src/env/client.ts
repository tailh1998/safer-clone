/* eslint-disable n/no-process-env */
import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  client: {
    NEXT_PUBLIC_THE_MOVIE_DB_API_KEY: z.string(),
    NEXT_PUBLIC_THE_MOVIE_DB_API_URL: z.string().url()
  },
  runtimeEnv: {
    NEXT_PUBLIC_THE_MOVIE_DB_API_KEY: process.env.NEXT_PUBLIC_THE_MOVIE_DB_API_KEY,
    NEXT_PUBLIC_THE_MOVIE_DB_API_URL: process.env.NEXT_PUBLIC_THE_MOVIE_DB_API_URL
  }
})
