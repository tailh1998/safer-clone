import { type NextRequest, NextResponse } from "next/server"

import { env } from "@/env/client"

const API_KEY = env.NEXT_PUBLIC_THE_MOVIE_DB_API_KEY
const API_URL = env.NEXT_PUBLIC_THE_MOVIE_DB_API_URL

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const tab = searchParams.get("tab") || "now-playing"
  const page = searchParams.get("page") || "1"

  if (!API_KEY) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 })
  }

  try {
    const endpoint =
      tab === "now-playing" ? `${API_URL}/movie/now_playing` : `${API_URL}/movie/top_rated`

    const url = `${endpoint}?api_key=${API_KEY}&page=${page}`
    const response = await fetch(url)

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch movies" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
