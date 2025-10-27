"use client"

import Link from "next/link"
import { useEffect } from "react"

import "@/styles/error.scss"

export default function ErrorPage({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    console.error("App error:", error)
  }, [error])

  return (
    <div className="error-page">
      <div className="error-page__content">
        <h1 className="error-page__title">😢 Oops! Something went wrong</h1>
        <p className="error-page__message">
          {error.message ||
            "An unexpected error occurred. Please click the button below to try again."}
        </p>

        <button
          type="button"
          className="error-page__button"
        >
          <Link href="/">Home</Link>
        </button>
      </div>
    </div>
  )
}
