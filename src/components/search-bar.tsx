"use client"

import { useRouter } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"

export default function SearchBar() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    setIsOpen(!!value)
  }, [])

  const handleClear = () => {
    setQuery("")
    setResults([])
    setIsOpen(false)
  }

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/movies/search?query=${encodeURIComponent(query)}`)
        const data = await res.json()
        setResults(data || [])
      } catch (err) {
        console.error("Search failed:", err)
      } finally {
        setLoading(false)
      }
    }, 400)
  }, [query])

  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div
      className="search-bar"
      ref={containerRef}
    >
      <input
        type="text"
        className="search-bar__input"
        placeholder="Search movies..."
        value={query}
        onChange={handleChange}
      />
      {query && (
        <button
          type="button"
          className="search-bar__clear"
          onClick={handleClear}
          aria-label="Clear search"
        >
          ✕
        </button>
      )}

      {isOpen && (
        <div className="search-bar__popover">
          {loading ? (
            <div className="search-bar__loading">Loading...</div>
          ) : results.length > 0 ? (
            <ul className="search-bar__list">
              {results.map((movie) => (
                <li
                  key={movie.id}
                  className="search-bar__item"
                  onClick={() => router.push(`/movie/${movie.id}`)}
                >
                  {movie.title}
                </li>
              ))}
            </ul>
          ) : (
            <div className="search-bar__empty">No results found</div>
          )}
        </div>
      )}
    </div>
  )
}
