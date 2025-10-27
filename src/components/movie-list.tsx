"use client"

import { useEffect, useState } from "react"

import ErrorState from "./error-state"
import LoadingState from "./loading-state"
import MovieCard from "./movie-card"

interface Movie {
  id: number
  title: string
  poster_path: string
  release_date: string
  vote_average: number
  overview: string
}

interface MovieListProps {
  tab: "now-playing" | "top-rated"
  searchQuery: string
  viewType: "list" | "grid"
  onMovieSelect: (movie: Movie) => void
}

export default function MovieList({ tab, searchQuery, viewType, onMovieSelect }: MovieListProps) {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/movies?tab=${tab}`)

        if (!response.ok) throw new Error("Failed to fetch movies")

        const data = await response.json()
        setMovies(data.results || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    loadMovies()
  }, [tab])

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) return <LoadingState viewType={viewType} />
  if (error) return <ErrorState message={error} />

  return (
    <div className={`movie-list movie-list--${viewType}`}>
      {filteredMovies.length === 0 ? (
        <div className="no-results">No movies found</div>
      ) : (
        filteredMovies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            viewType={viewType}
            onClick={() => onMovieSelect(movie)}
          />
        ))
      )}
    </div>
  )
}
