import Image from "next/image"

import { CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"

export function AboutSection() {
  const achievements = [
    "Over 20 years of industry experience",
    "1000+ successful installations",
    "Australian owned and operated",
    "Certified safety compliance",
    "24/7 support and maintenance"
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Why Choose Safer Storage Systems?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              We are Australia's leading provider of storage solutions, specializing in pallet
              racking, mezzanine floors, warehouse automation, and shelving systems. Our commitment
              to safety, quality, and innovation has made us the trusted choice for businesses
              across the country.
            </p>

            <div className="space-y-4 mb-8">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3"
                >
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">{achievement}</span>
                </div>
              ))}
            </div>

            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700"
            >
              Learn More About Us
            </Button>
          </div>

          <div className="relative">
            <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
              <Image
                src="/images/SSS-Team.jpg"
                alt="Safer Storage Systems & Gonvarri Material Handling"
                width={600}
                height={400}
                className="h-full w-full"
                priority
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-green-600 text-white p-6 rounded-lg">
              <div className="text-3xl font-bold">20+</div>
              <div className="text-sm">Years Experience</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
