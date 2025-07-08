import type { Metadata } from "next"
import { Inter } from "next/font/google"
import type React from "react"

import ThemeProvider from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

import "./global.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Pallet Racking, Warehouse Automation & Storage System Supplier",
  description:
    "Safer Storage Systems is Australia's leading Pallet Racking and Warehouse Storage experts with local manufacturing capabilities. Contact our team today!"
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
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
