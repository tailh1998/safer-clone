"use client"

import { useRouter } from "next/navigation"

import "@/styles/not-found.scss"

export default function NotFoundPage() {
  const router = useRouter()

  return (
    <div className="not-found">
      <div className="not-found__content">
        <h1 className="not-found__title">😢 Page Not Found</h1>
        <p className="not-found__message">The page you are looking for does not exist.</p>
        <button
          type="button"
          className="not-found__button"
          onClick={() => router.push("/")}
        >
          🏠 Go Home
        </button>
      </div>
    </div>
  )
}
