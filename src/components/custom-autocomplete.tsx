"use client"

import type React from "react"
import { ReactNode, useEffect, useRef, useState } from "react"

import { Check, ChevronDown, Inbox, Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"

import { cn } from "@/lib/utils"

import ClientOnlyPortal from "./client-only-portal"

interface AutocompleteItem<T> {
  label: string
  value: string | number
  base_data?: T
  disabled?: boolean
}

interface AutocompleteProps<T> {
  options: AutocompleteItem<T>[]
  placeholder?: string
  onChange?: (value?: string | number, base_data?: T) => void
  className?: string
  /** custom filter option */
  filteredOptions?: (inputValue: string, option?: AutocompleteItem<T>) => boolean
  keepInputValue?: boolean
  /** cho phép clear selected option hay ko */
  allowClear: boolean
  /** disabled input */
  disabled?: boolean
  /** làm gì đó với onBlur */
  onBlur?: (value?: string | number, base_data?: T) => void
  /** làm gì đó với onClear */
  onClear?: () => void
  optionRender?: (option?: AutocompleteItem<T>) => ReactNode
  showSearchIcon?: boolean
  value?: string | AutocompleteItem<T> | null
  loading?: boolean
  name: string
}

export const BaseAutocomplete = <T,>({
  options,
  placeholder = "Tìm kiếm...",
  onChange,
  className,
  filteredOptions,
  keepInputValue = false,
  allowClear,
  disabled = false,
  onBlur,
  onClear,
  optionRender,
  showSearchIcon = true,
  value,
  loading,
  name
}: AutocompleteProps<T>) => {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [selectedItem, setSelectedItem] = useState<AutocompleteItem<T> | null>(null)
  const [pos, setPos] = useState<{ top: number; left: number; width: number }>({
    top: 0,
    left: 0,
    width: 0
  })

  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const portalRef = useRef<HTMLDivElement>(null)

  const getFilteredOptions = () => {
    if (!query || (selectedItem && selectedItem?.label === query)) return options
    return options.filter((option) =>
      filteredOptions
        ? filteredOptions(query, option)
        : option.label.toLowerCase().includes(query.toLowerCase())
    )
  }

  //set Value cho autocomplete
  useEffect(() => {
    let queryStr = ""
    let selItemVal = null
    if (typeof value === "string" || typeof value === "number") {
      const foundItem = options?.find((x) => x.value === value)
      if (foundItem) {
        queryStr = foundItem?.label
        selItemVal = foundItem
      } else {
        queryStr = ""
        selItemVal = null
      }
    } else if (typeof value === "object") {
      queryStr = value?.label ?? ""
      selItemVal = value
    }
    setSelectedItem(selItemVal)
    setQuery(queryStr)
  }, [value, options])

  // Handle item selection
  const handleSelect = (item: AutocompleteItem<T>) => {
    if (selectedItem?.value === item.value) {
      setSelectedItem(null)
      setQuery("")
      onChange?.()
      onBlur?.()
    } else {
      setSelectedItem(item)
      setQuery(item.label)
      setIsOpen(false)
      onChange?.(item.value, item.base_data)
      onBlur?.(item.value, item.base_data)
    }
    setSelectedIndex(-1)
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsOpen(true)
        return
      }
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prev) => (prev < getFilteredOptions().length - 1 ? prev + 1 : 0))
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : getFilteredOptions().length - 1))
        break
      case "Enter":
        e.preventDefault()
        if (selectedIndex >= 0 && getFilteredOptions()[selectedIndex]) {
          /** nếu ko bị disabled mới chọn được */
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          !getFilteredOptions()[selectedIndex]?.disabled &&
            handleSelect(getFilteredOptions()[selectedIndex])
        }
        break
      case "Escape":
        setIsOpen(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
      case "Tab":
        // Auto-select first match if there's a clear match or only one result
        if (getFilteredOptions().length > 0) {
          // Check if query is a prefix of the first result
          const firstItem = getFilteredOptions()[0]
          const queryLower = query.toLowerCase()
          const labelLower = firstItem.label.toLowerCase()

          // Auto-select if query is a prefix of label/value or there's only one result
          if (
            queryLower.length > 0 &&
            labelLower.startsWith(queryLower) &&
            (!selectedItem || (selectedItem && queryLower !== selectedItem?.label?.toLowerCase()))
          ) {
            e.preventDefault()
            handleSelect(firstItem)

            // Move focus to next field after selection
            setTimeout(() => {
              const form = inputRef.current?.form
              if (form) {
                const elements = Array.from(form.elements) as HTMLElement[]
                const currentIndex = elements.indexOf(inputRef.current!)
                const nextElement = elements[currentIndex + 1]

                if (nextElement && "focus" in nextElement) {
                  ; (nextElement as HTMLInputElement).focus()
                }
              } else {
                // Fallback: try to find next focusable element, excluding buttons within this component
                const focusableElements = document.querySelectorAll(
                  // eslint-disable-next-line quotes
                  'input:not([data-autocomplete-clear]), select, textarea, button:not([data-autocomplete-clear]), [tabindex]:not([tabindex="-1"]):not([data-autocomplete-clear])'
                )
                const currentIndex = Array.from(focusableElements).indexOf(inputRef.current!)
                const nextElement = focusableElements[currentIndex + 1] as HTMLElement

                if (nextElement) {
                  nextElement.focus()
                }
              }
            }, 0)
            return
          }
        }

        // If no clear match, just close dropdown and let Tab proceed naturally
        setIsOpen(false)
        setSelectedIndex(-1)
        break
    }
  }

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    setIsOpen(true)
    setSelectedIndex(-1)

    // if (!value.trim()) {
    //       setSelectedItem(null)
    // }
    // else {
    //       // Check for exact match and auto-select
    //       const exactMatch = options.find(
    //             (item) =>
    //                   item.label.toLowerCase() === value.toLowerCase(),
    //       )

    //       if (exactMatch) {
    //             setSelectedItem(exactMatch)
    //       }
    // }
  }

  // Clear selection
  const handleClear = () => {
    setQuery("")
    setSelectedItem(null)
    setIsOpen(false)
    setSelectedIndex(-1)
    inputRef.current?.focus()
    onChange?.()
    onBlur?.()
    onClear?.()
  }

  /** hàm on blur */
  const handleBlur = () => {
    if (selectedItem) {
      //TODO:
      if (keepInputValue) {
      } else {
        if (!isOpen) {
          setQuery(selectedItem?.label)
        }
      }
    } else {
      //TODO:
      if (keepInputValue) {
      } else {
        if (!isOpen) {
          setQuery("")
        }
      }
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node

      // Check if the click is inside the input container or the portal dropdown
      const insideContainer = containerRef.current?.contains(target)
      const insidePortal = portalRef.current?.contains(target)

      if (!insideContainer && !insidePortal) {
        setIsOpen(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const selectedElement = listRef.current.children[selectedIndex] as HTMLElement
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth"
        })
      }
    }
  }, [selectedIndex])

  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setPos({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      })
    }
  }, [isOpen])

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full", className)}
    >
      <div className="relative">
        {loading && <Skeleton className="absolute left-2 top-2 z-10 h-5 w-[96%] bg-muted pr-10" />}
        {showSearchIcon && !loading && (
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
        )}

        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={loading ? "" : placeholder}
          className="pl-10 pr-10"
          autoComplete="off"
          onBlur={handleBlur}
          disabled={disabled || loading}
        />
        {!query && !loading && (
          <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
        )}

        {query && allowClear && (
          <Button
            disabled={disabled}
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            data-autocomplete-clear="true"
            className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 transform p-0 hover:bg-muted"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {isOpen && (
        <ClientOnlyPortal selector={name}>
          <div
            ref={portalRef}
            className="absolute left-0 right-0 top-full z-50 mt-1 rounded-md border bg-popover shadow-md"
            style={{
              zIndex: 1000,
              top: pos.top,
              left: pos.left,
              width: pos.width,
              position: "absolute",
              pointerEvents: "auto"
            }}
          >
            <div className="max-h-60 overflow-y-auto ">
              <div
                ref={listRef}
                className="p-1"
              >
                {getFilteredOptions().length > 0 ? (
                  getFilteredOptions().map((item, index) => (
                    <div
                      key={item.value}
                      onClick={() => !item.disabled && handleSelect(item)}
                      className={cn(
                        item.disabled
                          ? "cursor-not-allowed text-gray-200 hover:bg-transparent dark:text-gray-500 "
                          : "cursor-pointer hover:bg-gray-200 dark:hover:bg-accent",
                        "flex  items-center justify-between rounded-sm px-3 py-2 text-sm transition-colors ",
                        index === selectedIndex &&
                        !item.disabled &&
                        "bg-gray-200 text-accent-foreground dark:bg-accent dark:text-white dark:hover:bg-accent",
                        selectedItem?.value === item.value &&
                        "bg-primary/10 dark:bg-gray-300 dark:text-black dark:hover:text-white"
                      )}
                    >
                      {optionRender ? (
                        optionRender(item)
                      ) : (
                        <div className="min-w-0 flex-1">
                          <div className="truncate font-medium">{item.label}</div>
                        </div>
                      )}

                      {selectedItem?.value === item.value && (
                        <Check className="ml-2 h-4 w-4 flex-shrink-0 text-primary dark:text-black dark:hover:text-white" />
                      )}
                    </div>
                  ))
                ) : query.trim() ? (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    <div className="flex flex-col items-center gap-1 px-3 py-2 text-center text-sm text-muted-foreground">
                      <Inbox className="text-gray-500" />
                      <div>Không tìm thấy kết quả</div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1 px-3 py-2 text-center text-sm text-muted-foreground">
                    <Inbox className="text-gray-500" />
                    <div>Trống</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ClientOnlyPortal>
      )}
    </div>
  )
}
