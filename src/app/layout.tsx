import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import Link from "next/link"
import type React from "react"

import SearchBar from "@/components/search-bar"

import "./global.scss"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans"
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono"
})

export const metadata: Metadata = {
  title: "Movies App",
  description: "Browse movies with The Movie Database API"
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div className="app-container">
          <header className="app-header">
            <h1 className="logo">
              <Link href="/">Elotus Movies</Link>
            </h1>
            <SearchBar />
          </header>
          <main className="app-main-wrapper">{children}</main>
        </div>
      </body>
    </html>
  )
}
