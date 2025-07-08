"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

import { ChevronDown, Menu, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const navigationItems = [
    {
      name: "PALLET RACKING",
      href: "/pallet-racking",
      hasDropdown: true,
      dropdownItems: [
        { name: "Pallet Racking Systems", href: "/pallet-racking" },
        { name: "Selective Racking", href: "/selective-racking" },
        { name: "Narrow Aisle Racking", href: "/narrow-aisle-racking" },
        { name: "Drive In Racking", href: "/drive-in-racking" },
        { name: "Double Deep Racking", href: "/double-deep-racking" },
        { name: "Push Back Racking", href: "/push-back-racking" },
        { name: "Pallet Flow", href: "/pallet-flow" },
        { name: "Carton Live Storage", href: "/carton-live-storage" },
        { name: "Mobile Racking (MOVO)", href: "/mobile-racking-movo" },
        { name: "Mini Load", href: "/mini-load" },
        { name: "Cantilever Racking", href: "/cantilever-racking" },
        { name: "Pallet Shuttle", href: "/pallet-shuttle" },
        { name: "ASRS", href: "/asrs" }
      ]
    },
    {
      name: "MEZZANINE",
      href: "/mezzanine",
      hasDropdown: true,
      dropdownItems: [
        { name: "Mezzanine Storage Systems", href: "/mezzanine" },
        { name: "Racking Based Mezzanine", href: "/racking-based-mezzanine" },
        { name: "Structural Mezzanine", href: "/structural-mezzanine" },
        { name: "HI280 Supported Mezzanine", href: "/hi280-mezzanine" },
        { name: "Mezzanine Accessories", href: "/mezzanine-accessories" }
      ]
    },
    {
      name: "AUTOMATION",
      href: "/automation",
      hasDropdown: true,
      dropdownItems: [
        { name: "Warehouse Automation Systems", href: "/automation" },
        { name: "MOBILE ROBOTS", href: "/mobile-robots" },
        { name: "Vertical Lift Module (VLM)", href: "/vertical-lift-module" },
        { name: "Mobile Racking (MOVO)", href: "/mobile-racking-movo" },
        { name: "Pallet Shuttle", href: "/pallet-shuttle" },
        { name: "ASRS", href: "/asrs" },
        { name: "Mini Load", href: "/mini-load" }
      ]
    },
    {
      name: "SHELVING",
      href: "/shelving",
      hasDropdown: true,
      dropdownItems: [
        { name: "Shelving Systems", href: "/shelving" },
        { name: "HI280 Shelving", href: "/hi280-shelving" },
        { name: "Mobile Shelving", href: "/mobile-shelving" },
        { name: "Widespan Shelving", href: "/widespan-shelving" },
        { name: "Roll Post Shelving", href: "/roll-post-shelving" },
        { name: "Mini Load", href: "/mini-load" },
        { name: "Narrow Aisle", href: "/narrow-aisle-shelving" },
        { name: "Accessories", href: "/shelving-accessories" }
      ]
    },
    { name: "BROCHURES", href: "/brochures", hasDropdown: false },
    { name: "NEWS & PROJECTS", href: "/news-projects", hasDropdown: false }
  ]

  return (
    <header className="bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm border-b border-gray-100">
      {/* Top bar with contact info and buttons */}
      <div className="bg-white py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link
                href="/"
                className="flex items-center"
              >
                <Image
                  src="/images/sss-gonvarri-logo.png"
                  alt="Safer Storage Systems & Gonvarri Material Handling"
                  width={300}
                  height={80}
                  className="h-16 w-auto"
                  priority
                />
              </Link>
            </div>

            {/* Right side - Contact and buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              <div className="text-green-600 font-bold text-lg">CALL (03) 9792 0101</div>
              <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 font-bold">
                CONTACT US
              </Button>
              <Button className="bg-black hover:bg-gray-800 text-white px-6 py-2 font-bold">
                ABOUT US
              </Button>
            </div>

            {/* Mobile menu trigger */}
            <Sheet
              open={isOpen}
              onOpenChange={setIsOpen}
            >
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="lg:hidden bg-transparent"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-80"
              >
                <div className="flex flex-col space-y-4 mt-8">
                  <div className="mb-4">
                    <Image
                      src="/images/sss-gonvarri-logo.png"
                      alt="Safer Storage Systems & Gonvarri Material Handling"
                      width={250}
                      height={60}
                      className="h-12 w-auto"
                    />
                  </div>
                  <div className="text-green-600 font-bold text-lg mb-4">CALL (03) 9792 0101</div>
                  <Button className="bg-green-600 hover:bg-green-700 text-white w-full">
                    CONTACT US
                  </Button>
                  <Button className="bg-black hover:bg-gray-800 text-white w-full">ABOUT US</Button>
                  <div className="border-t pt-4">
                    {navigationItems.map((item) => (
                      <div
                        key={item.name}
                        className="mb-4"
                      >
                        <Link
                          href={item.href}
                          className="text-gray-800 hover:text-green-600 font-bold py-2 block"
                          onClick={() => setIsOpen(false)}
                        >
                          {item.name}
                        </Link>
                        {item.hasDropdown && (
                          <div className="ml-4 mt-2 space-y-1">
                            {item.dropdownItems?.map((dropdownItem) => (
                              <Link
                                key={dropdownItem.name}
                                href={dropdownItem.href}
                                className="text-sm text-gray-600 hover:text-green-600 block py-1"
                                onClick={() => setIsOpen(false)}
                              >
                                {dropdownItem.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Navigation bar */}
      <div className="border-t border-gray-200">
        <div className="container mx-auto px-4">
          <nav className="hidden lg:flex items-center justify-between py-4">
            <div className="flex items-center space-x-8">
              {navigationItems.map((item) => (
                <div
                  key={item.name}
                  className="relative group"
                >
                  {item.hasDropdown ? (
                    <>
                      <Link
                        href={item.href}
                        className="flex items-center space-x-1 text-gray-800 hover:text-green-600 font-bold text-sm transition-colors py-2"
                      >
                        <span>{item.name}</span>
                        <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                      </Link>

                      {/* Hover Dropdown */}
                      <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div className="grid grid-cols-2 gap-1 p-4">
                          {item.dropdownItems?.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.name}
                              href={dropdownItem.href}
                              className="text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 p-2 rounded transition-colors"
                            >
                              {dropdownItem.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-gray-800 hover:text-green-600 font-bold text-sm transition-colors py-2"
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Search icon */}
            <div className="flex items-center">
              <Search className="w-5 h-5 text-green-600 cursor-pointer hover:text-green-700" />
            </div>
          </nav>
        </div>
      </div>

      {/* Green accent line */}
      <div className="h-1 bg-green-600"></div>
    </header>
  )
}
