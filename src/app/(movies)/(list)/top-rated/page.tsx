"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

import ErrorState from "@/components/error-state"
import LoadingState from "@/components/loading-state"
import MovieCard from "@/components/movie-card"
import Pagination from "@/components/pagination"

interface Movie {
  id: number
  title: string
  poster_path: string
  release_date: string
  vote_average: number
  overview: string
}

export default function TopRatedPage() {
  const searchParams = useSearchParams()
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(0)

  const viewType = (searchParams.get("view") as "list" | "grid") || "grid"
  const currentPage = Number.parseInt(searchParams.get("page") || "1", 10)

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/movies?tab=top-rated&page=${currentPage}`)
        if (!response.ok) throw new Error("Failed to fetch movies")
        const data = await response.json()
        setMovies(data.results || [])
        setTotalPages(data.total_pages || 1)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    loadMovies()
  }, [currentPage])

  if (loading) return <LoadingState viewType={viewType} />
  if (error) return <ErrorState message={error} />

  return (
    <>
      <div className={`movie-list movie-list--${viewType}`}>
        {movies.map((movie) => (
          <Link
            key={movie.id}
            href={`/movie/${movie.id}`}
            className="movie-card-link"
          >
            <MovieCard
              movie={movie}
              viewType={viewType}
            />
          </Link>
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </>
  )
}
