"use client"

import { useMemo, useState } from "react"

import { isNumber } from "lodash"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink
} from "./ui/pagination"

export const PaginationPrevious = ({
  className,
  label,
  ...props
}: React.ComponentProps<typeof PaginationLink> & { label?: string }) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn("gap-1 pl-2.5 cursor-pointer", className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>{label}</span>
  </PaginationLink>
)
PaginationPrevious.displayName = "PaginationPrevious"

export const PaginationNext = ({
  className,
  label,
  ...props
}: React.ComponentProps<typeof PaginationLink> & { label?: string }) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn("gap-1 pr-2.5 cursor-pointer", className)}
    {...props}
  >
    <span>{label}</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
)
PaginationNext.displayName = "PaginationNext"

const ELLIPSIS = "..."
const MyPagination = ({
  totalPages,
  currentPage,
  onPageChange
}: {
  totalPages: number
  currentPage: number
  onPageChange: (newPage: number) => void
}) => {
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      onPageChange(newPage)
    }
  }

  const getPaginationRange = (currentPage: number, totalPages: number): (number | string)[] => {
    const delta = 2
    let start = currentPage - delta
    let end = currentPage + delta
    start = Math.max(2, start)
    end = Math.min(totalPages - 1, end)

    if (currentPage <= 3) {
      start = 2
      end = 5
    }

    if (currentPage >= totalPages - 2) {
      start = totalPages - 4
      end = totalPages - 1
    }

    const pages: (number | string)[] = []

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
      // z: Early Return
      return pages
    }

    pages.push(1)

    if (start > 2) {
      pages.push(ELLIPSIS)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (end < totalPages - 1) {
      pages.push(ELLIPSIS)
    }

    pages.push(totalPages)

    return pages
  }

  const pageRange = useMemo(
    () => getPaginationRange(currentPage, totalPages),
    [currentPage, totalPages]
  )

  return (
    <Pagination className="mx-0 w-full p-1 justify-end">
      <PaginationContent>
        {/* Previous */}
        <PaginationItem>
          <PaginationPrevious
            className={cn(currentPage <= 1 && "cursor-not-allowed opacity-50")}
            onClick={() => handlePageChange(currentPage - 1)}
            label="Trang trước"
          />
        </PaginationItem>

        {pageRange.map((page, idx) =>
          isNumber(page) ? (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                isActive={currentPage === page}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ) : (
            <PaginationEllipsis key={`ellipsis-${idx}`} />
          )
        )}

        {/* Next */}
        <PaginationItem>
          <PaginationNext
            className={cn(currentPage >= totalPages && "cursor-not-allowed opacity-50")}
            onClick={() => handlePageChange(currentPage + 1)}
            label="Trang sau"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

const MOCK_DATA = Array.from({ length: 42 }, (_, i) => ({
  id: i + 1,
  name: `Item ${i + 1}`
}))

const ITEMS_PER_PAGE = 5

export default function PaginationExample() {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(MOCK_DATA.length / ITEMS_PER_PAGE)

  const currentItems = MOCK_DATA.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Pagination Example</h2>

      {/* Mock content */}
      <ul className="border rounded-lg p-3 space-y-2">
        {currentItems.map((item) => (
          <li
            key={item.id}
            className="text-sm"
          >
            {item.name}
          </li>
        ))}
      </ul>

      {/* Pagination Component */}
      <MyPagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}
