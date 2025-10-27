"use client"

import { useEffect, useRef, useState } from "react"

interface LazyImageProps {
  src: string
  alt: string
}

export default function LazyImage({ src, alt }: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: "50px" }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div
      className="lazy-image"
      ref={containerRef}
    >
      {!isLoaded && <div className="lazy-image__skeleton" />}
      {isVisible && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src || "/placeholder.svg"}
          alt={alt}
          className={`lazy-image__img ${isLoaded ? "lazy-image__img--loaded" : ""}`}
          onLoad={() => setIsLoaded(true)}
        />
      )}
    </div>
  )
}
