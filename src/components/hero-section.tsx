import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

import { DialogDemo } from "./custom-dialog"

export function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Storage Solutions
            <span className="block text-green-200">That Work</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-green-100">
            Leading provider of pallet racking, mezzanine floors, automation systems, and shelving
            solutions across Australia
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-green-600 hover:bg-gray-100"
            >
              Get Quote
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-green-600 bg-transparent"
            >
              View Projects
            </Button>

            <DialogDemo />
          </div>
        </div>
      </div>
    </section>
  )
}
