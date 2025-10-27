"use client"

import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import type React from "react"
import { Suspense, useCallback, useEffect, useState } from "react"

import SearchBar from "@/components/search-bar"
import ViewToggle from "@/components/view-toggle"

type ViewType = "list" | "grid"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-main">
      <Suspense fallback={<div>Loading...</div>}>
        <Controls />
      </Suspense>
      {children}
    </div>
  )
}

function Controls() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const view = searchParams.get("view")

  const [viewType, setViewType] = useState<ViewType>(
    (searchParams.get("view") as ViewType) || "list"
  )

  const handleViewChange = useCallback(
    (view: ViewType) => {
      setViewType(view)
      const params = new URLSearchParams(searchParams)
      params.set("view", view)
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  useEffect(() => {
    if (!view) {
      handleViewChange("grid")
    }
  }, [view, handleViewChange])

  return (
    <div className="controls-section">
      <SearchBar />
      <div className="controls-row">
        <nav className="tab-navigation">
          <Link
            href="/now-playing"
            className={`tab-navigation__link ${pathname.includes("now-playing") ? "tab-navigation__link--active" : ""}`}
          >
            Now Playing
          </Link>
          <Link
            href="/top-rated"
            className={`tab-navigation__link ${pathname.includes("top-rated") ? "tab-navigation__link--active" : ""}`}
          >
            Top Rated
          </Link>
        </nav>
        <ViewToggle
          viewType={viewType}
          onViewChange={handleViewChange}
        />
      </div>
    </div>
  )
}
