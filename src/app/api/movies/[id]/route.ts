import { type NextRequest, NextResponse } from "next/server"

import { env } from "@/env/client"

const API_KEY = env.NEXT_PUBLIC_THE_MOVIE_DB_API_KEY
const API_URL = env.NEXT_PUBLIC_THE_MOVIE_DB_API_URL

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  if (!API_KEY) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 })
  }

  try {
    const response = await fetch(`${API_URL}/movie/${params.id}?api_key=${API_KEY}`)

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch movie details" },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
