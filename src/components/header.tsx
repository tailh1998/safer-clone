"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"

const NAV_ITEMS = [
  {
    href: "/",
    label: "Home"
  },
  {
    href: "/create",
    label: "Create Task"
  },
  {
    href: "/dashboard",
    label: "Dashboard"
  }
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="border-b">
      <div className="flex h-16 items-center justify-center px-4">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="font-bold text-xl"
            >
              5s3s Task Manager
            </Link>
            <nav className="hidden md:flex gap-6">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <div className="block md:hidden">
              <Button
                variant="ghost"
                size="icon"
                asChild
              >
                <Link href="/create">
                  <span className="sr-only">Create Task</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M5 12h14" />
                    <path d="M12 5v14" />
                  </svg>
                </Link>
              </Button>
            </div>
            <div className="block md:hidden">
              <Button
                variant="ghost"
                size="icon"
                asChild
              >
                <Link href="/dashboard">
                  <span className="sr-only">Dashboard</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <rect
                      width="7"
                      height="7"
                      x="3"
                      y="3"
                      rx="1"
                    />
                    <rect
                      width="7"
                      height="7"
                      x="14"
                      y="3"
                      rx="1"
                    />
                    <rect
                      width="7"
                      height="7"
                      x="14"
                      y="14"
                      rx="1"
                    />
                    <rect
                      width="7"
                      height="7"
                      x="3"
                      y="14"
                      rx="1"
                    />
                  </svg>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
