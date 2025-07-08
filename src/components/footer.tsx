import Image from "next/image"
import Link from "next/link"

import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-green-600 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="mb-6">
              <Image
                src="/images/sss-gonvarri-logo.png"
                alt="Safer Storage Systems & Gonvarri Material Handling"
                width={200}
                height={60}
                className="h-12 w-auto brightness-0 invert"
              />
            </div>
            <div className="space-y-2 text-green-100">
              <div className="font-semibold text-white">Safer Storage Systems</div>
              <div>21 Capital Drive</div>
              <div>Dandenong South, VIC 3175</div>
              <div>P: (03) 9792 0101</div>
              <div>E: info@saferstoragesystems.com.au</div>
            </div>
            <div className="mt-4 text-sm text-green-100">
              <div>
                <strong>Office Hours:</strong> 8am - 4:30pm
              </div>
              <div>
                <strong>Warehouse Deliveries:</strong> 6:30am - 2pm
              </div>
            </div>
          </div>

          {/* Info Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">INFO</h3>
            <div className="space-y-2">
              <Link
                href="/about"
                className="block text-green-100 hover:text-white transition-colors"
              >
                ABOUT US
              </Link>
              <Link
                href="/contact"
                className="block text-green-100 hover:text-white transition-colors"
              >
                CONTACT
              </Link>
              <Link
                href="/news"
                className="block text-green-100 hover:text-white transition-colors"
              >
                NEWS & PROJECTS
              </Link>
              <Link
                href="/partnership"
                className="block text-green-100 hover:text-white transition-colors"
              >
                GMH PARTNERSHIP
              </Link>
              <Link
                href="/privacy"
                className="block text-green-100 hover:text-white transition-colors"
              >
                PRIVACY POLICY
              </Link>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-bold text-lg mb-4">PRODUCTS</h3>
            <div className="space-y-2">
              <Link
                href="/pallet-racking"
                className="block text-green-100 hover:text-white transition-colors"
              >
                PALLET RACKING SYSTEMS
              </Link>
              <Link
                href="/mezzanine"
                className="block text-green-100 hover:text-white transition-colors"
              >
                MEZZANINE FLOOR RACKING SYSTEMS
              </Link>
              <Link
                href="/automation"
                className="block text-green-100 hover:text-white transition-colors"
              >
                WAREHOUSE AUTOMATION
              </Link>
              <Link
                href="/shelving"
                className="block text-green-100 hover:text-white transition-colors"
              >
                SHELVING
              </Link>
            </div>
          </div>

          {/* Partner Logo */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Image
                src="/images/sss-gonvarri-logo.png"
                alt="Safer Storage Systems & Gonvarri Material Handling"
                width={200}
                height={60}
                className="h-12 w-auto brightness-0 invert"
              />
            </div>

            {/* Social Media */}
            <div className="flex space-x-4 mt-6">
              <Link
                href="#"
                className="text-green-100 hover:text-white transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="text-green-100 hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="text-green-100 hover:text-white transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="text-green-100 hover:text-white transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-green-500 mt-8 pt-8 text-center text-green-100">
          <p>Safer Storage Systems Pty Ltd © Copyright 2006-2025</p>
        </div>
      </div>
    </footer>
  )
}
