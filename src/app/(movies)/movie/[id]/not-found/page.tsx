"use client"

import Link from "next/link"

export default function MovieNotFound() {
  return (
    <div className="movie-details">
      <div className="movie-details__overlay">
        <button
          type="button"
          className="movie-details__back"
        >
          <Link href="/">← Back</Link>
        </button>

        <div className="movie-details__container">
          <div
            className="movie-details__content"
            style={{ textAlign: "center", padding: "2rem" }}
          >
            <h1 className="movie-details__title">😢 Movie Not Found</h1>
            <p className="movie-details__overview">
              The movie you are looking for does not exist or may have been removed.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
