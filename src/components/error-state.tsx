"use client"

interface ErrorStateProps {
  message: string
}

export default function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="error-state">
      <div className="error-state__icon">⚠</div>
      <h2 className="error-state__title">Oops! Something went wrong</h2>
      <p className="error-state__message">{message}</p>
      <p className="error-state__hint">Please check your internet connection and try again.</p>
    </div>
  )
}
