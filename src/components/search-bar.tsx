"use client"

import type React from "react"
import { useCallback, useState } from "react"

export default function SearchBar() {
  const [query, setQuery] = useState("")

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
  }, [])

  const handleClear = () => {
    setQuery("")
  }

  return (
    <div className="search-bar">
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
    </div>
  )
}
