"use client"

interface LoadingStateProps {
  viewType: "list" | "grid" | "detail"
}

export default function LoadingState({ viewType }: LoadingStateProps) {
  const skeletonCount = viewType === "grid" ? 12 : 6

  if (viewType === "detail") {
    return (
      <div className="movie-details movie-details__skeleton">
        <div className="skeleton__poster" />
        <div className="skeleton__content">
          <div className="skeleton__title" />
          <div className="skeleton__meta" />
          <div className="skeleton__meta" />
          <div className="skeleton__overview-line" />
          <div className="skeleton__overview-line" />
          <div className="skeleton__overview-line short" />
        </div>
      </div>
    )
  }

  return (
    <div className={`loading-state loading-state--${viewType}`}>
      {Array.from({ length: skeletonCount }).map((_, i) => (
        <div
          key={i}
          className="loading-state__skeleton"
        >
          <div className="loading-state__skeleton-image" />
          <div className="loading-state__skeleton-title" />
          <div className="loading-state__skeleton-meta" />
        </div>
      ))}
    </div>
  )
}
