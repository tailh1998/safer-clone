import { NextRequest, NextResponse } from "next/server"

import { env } from "@/env/client"

const API_KEY = env.NEXT_PUBLIC_THE_MOVIE_DB_API_KEY
const API_URL = env.NEXT_PUBLIC_THE_MOVIE_DB_API_URL

export async function GET(req: NextRequest) {
  if (!API_KEY) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 })
  }

  const { searchParams } = new URL(req.url)
  const query = searchParams.get("query")

  if (!query || query.trim() === "") {
    return NextResponse.json({ results: [] })
  }

  try {
    const response = await fetch(
      `${API_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
        query
      )}&language=en-US&page=1&include_adult=false`
    )

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch search results" },
        { status: response.status }
      )
    }
    const data = await response.json()
    const mappedResults = data.results.map((movie: any) => ({
      ...movie,
      id: movie.id,
      title: `[${movie.original_language.toUpperCase()}] - ${movie.title} - ${movie.release_date?.slice(0, 4) || "N/A"}`
    }))

    return NextResponse.json(mappedResults)
  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
