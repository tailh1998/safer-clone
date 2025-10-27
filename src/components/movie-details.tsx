"use client"

import LazyImage from "@/components/lazy-image"

interface MovieDetailsProps {
  movie: {
    id: number
    title: string
    poster_path: string
    release_date: string
    vote_average: number
    overview: string
    runtime: string
    genres: any[]
  }
  onBack: () => void
}

export default function MovieDetails({ movie, onBack }: MovieDetailsProps) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/movie-poster.jpg"

  const year = new Date(movie.release_date).getFullYear()
  const runtime = movie?.runtime ? `${movie.runtime} min` : "N/A"
  const genres = movie?.genres?.map((g: any) => g.name).join(", ") || "N/A"

  return (
    <div className="movie-details">
      <div className="movie-details__overlay">
        <button
          type="button"
          className="movie-details__back"
          onClick={onBack}
        >
          ← Back
        </button>

        <div className="movie-details__container">
          <div className="movie-details__poster">
            <LazyImage
              src={posterUrl}
              alt={movie.title}
            />
          </div>

          <div className="movie-details__content">
            <h1 className="movie-details__title">{movie.title}</h1>

            <div className="movie-details__meta">
              <span className="movie-details__year">{year}</span>
              <span className="movie-details__rating">★ {movie.vote_average?.toFixed(1)}/10</span>
              <span className="movie-details__runtime">{runtime}</span>
            </div>

            <div className="movie-details__genres">
              <strong>Genres:</strong> {genres}
            </div>

            <div className="movie-details__overview">
              <h2>Overview</h2>
              <p>{movie.overview || "No overview available."}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
