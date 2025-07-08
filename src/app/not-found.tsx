import Link from "next/link"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-2xl flex flex-col items-center justify-center mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">No Results Found</h1>
          <p className="text-lg text-gray-600 mb-8">
            The page you requested could not be found. Try refining your search, or use the
            navigation above to locate the post.
          </p>
          <div className="space-x-4">
            <Button asChild>
              <Link href="/">Go Home</Link>
            </Button>
            <Button
              variant="outline"
              asChild
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
