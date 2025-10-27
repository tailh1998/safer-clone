"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import LoadingState from "@/components/loading-state"
import MovieDetails from "@/components/movie-details"

interface Movie {
  id: number
  title: string
  poster_path: string
  release_date: string
  vote_average: number
  overview: string
  runtime: string
  genres: any[]
}

export default function MovieDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [movie, setMovie] = useState<Movie | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMovie = async () => {
      try {
        const response = await fetch(`/api/movies/${params.id}`)
        const data = await response.json()
        if (!data.error) {
          setMovie(data)
        }
      } catch (err) {
        console.error("Failed to fetch movie:", err)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      loadMovie()
    }
  }, [params.id])

  if (loading) return <LoadingState viewType="detail" />
  if (!movie) return router.push(`/movie/${params.id}/not-found`)

  return (
    <MovieDetails
      movie={movie}
      onBack={() => router.back()}
    />
  )
}
