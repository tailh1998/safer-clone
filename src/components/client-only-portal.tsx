"use client"

import { useEffect, useRef, useState } from "react"

import { createPortal } from "react-dom"

interface ClientOnlyPortalProps {
  children: React.ReactNode
  selector: string
}

const ClientOnlyPortal = ({ children, selector }: ClientOnlyPortalProps) => {
  const [mounted, setMounted] = useState(false)
  const ref = useRef<HTMLElement | null>(null)
  const createdRef = useRef(false)

  useEffect(() => {
    const id = `autocomplete-root-${selector}`
    let element = document.getElementById(id)

    // if not found, create it
    if (!element) {
      element = document.createElement("div")
      element.id = id
      document.body.appendChild(element)
      createdRef.current = true
    }

    ref.current = element
    setMounted(true)

    // cleanup if we created it
    return () => {
      if (createdRef.current && ref.current?.parentNode) {
        ref.current.parentNode.removeChild(ref.current)
      }
    }
  }, [selector])

  if (!mounted || !ref.current) return null

  return createPortal(children, ref.current)
}

export default ClientOnlyPortal
