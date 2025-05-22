import type { Metadata } from "next"
import { Inter } from "next/font/google"
import type React from "react"

import { Header } from "@/components/header"
import ThemeProvider from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

import "./global.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "5s3s Task Manager",
  description: "Create and manage tasks with AI assistance"
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
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
