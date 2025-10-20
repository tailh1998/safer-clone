'use client'

import type React from 'react'
import { useState, useRef, useEffect, ReactNode } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, X, Check, ChevronDown, Inbox } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Skeleton } from './ui/skeleton'
import { Popover, PopoverAnchor, PopoverContent } from './ui/popover'
import { PopoverPortal } from '@radix-ui/react-popover'
import { Badge } from './ui/badge'


interface AutocompleteItem<T> {
    label: string
    value: string | number
    base_data?: T
    disabled?: boolean
    _isCustomValue?: boolean
}

interface AutocompleteProps<T> {
    options: AutocompleteItem<T>[]
    placeholder?: string
    onChange?: (value?: any, base_data?: T) => void
    className?: string
    /** custom filter option */
    filteredOptions?: (
        inputValue: string,
        option?: AutocompleteItem<T>,
    ) => boolean
    keepInputValue?: boolean
    /** cho phép clear selected option hay ko */
    allowClear: boolean
    /** disabled input */
    disabled?: boolean
    /** làm gì đó với onBlur */
    onBlur?: (value?: any, base_data?: T) => void
    /** làm gì đó với onClear */
    onClear?: () => void
    optionRender?: (option?: AutocompleteItem<T>) => ReactNode
    showSearchIcon?: boolean
    value?: string | AutocompleteItem<T> | null | AutocompleteItem<T>[]
    loading?: boolean
    id?: string
    /**chế độ **/
    mode?: 'single' | 'multiple'
    /** dành cho multiple select */
    maxTagPlaceholder?: () => ReactNode
    /** làm gì đó với onSelect */
    onSelect?: (item?: AutocompleteItem<T>) => void
}

export const MultipleAutocomplete = <T,>({
    options,
    placeholder = 'Tìm kiếm...',
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
    id,
    mode = 'single',
    maxTagPlaceholder,
    onSelect,
}: AutocompleteProps<T>) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const listRef = useRef<HTMLDivElement>(null)
    const isTypingRef = useRef(false)
    const [query, setQuery] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(-1)
    // State for single mode
    const [selectedItem, setSelectedItem] =
        useState<AutocompleteItem<T> | null>(null)
    // State for multiple mode
    const [selectedItems, setSelectedItems] = useState<AutocompleteItem<T>[]>(
        [],
    )

    const getFilteredOptions = () => {
        if (mode === 'single') {
            if (!query || (selectedItem && selectedItem?.label === query))
                return options
            return options.filter((option) =>
                filteredOptions
                    ? filteredOptions(query, option)
                    : option.label
                        .toLowerCase()
                        .includes(query.toLowerCase()),
            )
        } else {
            if (!query) return options
            // Multiple mode - exclude already selected items
            return options.filter((option) =>
                filteredOptions
                    ? filteredOptions(query, option)
                    : option.label
                        .toLowerCase()
                        .includes(query.toLowerCase()),
            )
        }
    }
    //set Value cho autocomplete
    useEffect(() => {
        if (mode === 'single') {
            if (isTypingRef.current) return
            let queryStr = ''
            let selItemVal = null

            if (typeof value === 'string' || typeof value === 'number') {
                const foundItem = options?.find(
                    (x) => x.value === value,
                )
                if (foundItem) {
                    queryStr = foundItem?.label
                    selItemVal = foundItem
                } else {
                    queryStr = value
                    selItemVal = {
                        label: value,
                        value: '',
                        base_data: '',
                    }
                }
            } else if (typeof value === 'object') {
                queryStr = (value as any)?.label ?? ''
                selItemVal = value
            }
            setSelectedItem(selItemVal as any)
            setQuery(queryStr)
        } else {
            setSelectedItems(Array.isArray(value) ? value : [])
        }
    }, [value, options, mode])

    console.log('selectedItem', selectedItem)
    console.log('query', query)

    // Handle item selection
    const handleSelect = (item: AutocompleteItem<T>) => {
        if (mode === 'single') {
            if (selectedItem?.value === item.value) {
                setSelectedItem(null)
                setQuery('')
                onChange?.()
                onBlur?.()
                onSelect?.()
            } else {
                setSelectedItem(item)
                setQuery(item.label)
                setIsOpen(false)
                onChange?.(item.value, item?.base_data)
                onBlur?.(item.value, item?.base_data)
                onSelect?.(item)
            }
            isTypingRef.current = false
            setSelectedIndex(-1)
        } else {
            let newSelectedItems = [...(selectedItems ?? [])]
            const foundItem = newSelectedItems.findIndex(
                (x) => x.value === item.value,
            )
            /** nếu đã có option đó thì remove ra khỏi array */
            if (foundItem !== -1) {
                newSelectedItems = newSelectedItems.filter(
                    (x) => x.value !== item.value,
                )
            } else {
                /** nếu chưa chọn option đó lần nào */
                newSelectedItems.filter((x) => x.value !== item.value)
                newSelectedItems.push(item)
            }
            /** lấy các giá trị ra ngoài */
            setSelectedItems(newSelectedItems)
            onChange?.(newSelectedItems)
            onBlur?.(newSelectedItems)
            setQuery('')
            setSelectedIndex(-1)
        }
    }

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen) {
            if (e.key === 'ArrowDown' || e.key === 'Enter') {
                e.preventDefault()
                setIsOpen(true)
                return
            }
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault()
                setSelectedIndex((prev) =>
                    prev < getFilteredOptions().length - 1
                        ? prev + 1
                        : 0,
                )
                break
            case 'ArrowUp':
                e.preventDefault()
                setSelectedIndex((prev) =>
                    prev > 0
                        ? prev - 1
                        : getFilteredOptions().length - 1,
                )
                break
            case 'Enter':
                e.preventDefault()
                /** lấy các option có trong list */
                if (
                    selectedIndex >= 0 &&
                    getFilteredOptions()[selectedIndex]
                ) {
                    /** nếu ko bị disabled mới chọn được */
                    !getFilteredOptions()[selectedIndex]?.disabled &&
                        handleSelect(
                            getFilteredOptions()[selectedIndex],
                        )
                } else if (keepInputValue && query.trim()?.length > 0) {
                    /** lấy các option nhập tay */
                    const customItem: AutocompleteItem<T> = {
                        _isCustomValue: true,
                        label: query.trim(),
                        value: query.trim(),
                    }
                    handleSelect(customItem)
                }
                break
            case 'Escape':
                setIsOpen(false)
                setSelectedIndex(-1)
                inputRef.current?.blur()
                handleBlur()
                break
            case 'Backspace':
                if (
                    mode === 'multiple' &&
                    query === '' &&
                    selectedItems.length > 0
                ) {
                    e.preventDefault()
                    handleRemove(
                        selectedItems[selectedItems.length - 1],
                    )
                }
                break
            case 'Tab':
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
                        (!selectedItem ||
                            (selectedItem &&
                                queryLower !==
                                selectedItem?.label?.toLowerCase()))
                    ) {
                        e.preventDefault()
                        handleSelect(firstItem)

                        if (mode === 'single') {
                            // Move focus to next field after selection
                            setTimeout(() => {
                                const form =
                                    inputRef.current?.form
                                if (form) {
                                    const elements =
                                        Array.from(
                                            form.elements,
                                        ) as HTMLElement[]
                                    const currentIndex =
                                        elements.indexOf(
                                            inputRef.current!,
                                        )
                                    const nextElement =
                                        elements[
                                        currentIndex +
                                        1
                                        ]

                                    if (
                                        nextElement &&
                                        'focus' in
                                        nextElement
                                    ) {
                                        ; (
                                            nextElement as HTMLInputElement
                                        ).focus()
                                    }
                                } else {
                                    // Fallback: try to find next focusable element, excluding buttons within this component
                                    const focusableElements =
                                        document.querySelectorAll(
                                            'input:not([data-autocomplete-clear]), select, textarea, button:not([data-autocomplete-clear]), [tabindex]:not([tabindex="-1"]):not([data-autocomplete-clear])',
                                        )
                                    const currentIndex =
                                        Array.from(
                                            focusableElements,
                                        ).indexOf(
                                            inputRef.current!,
                                        )
                                    const nextElement =
                                        focusableElements[
                                        currentIndex +
                                        1
                                        ] as HTMLElement

                                    if (nextElement) {
                                        nextElement.focus()
                                    }
                                }
                            }, 0)
                            return
                        } else {
                            setQuery('')
                            inputRef?.current?.focus()
                            return
                        }
                    } else {
                        if (
                            mode === 'multiple' &&
                            keepInputValue &&
                            query.trim().length > 0
                        ) {
                            e.preventDefault()
                            /** lấy các option nhập tay */
                            const customItem: AutocompleteItem<T> =
                            {
                                _isCustomValue: true,
                                label: query.trim(),
                                value: query.trim(),
                            }
                            handleSelect(customItem)
                            setQuery('')
                            inputRef?.current?.focus()
                            return
                        }
                    }
                } else {
                    if (
                        mode === 'multiple' &&
                        keepInputValue &&
                        query.trim().length > 0
                    ) {
                        e.preventDefault()
                        /** lấy các option nhập tay */
                        const customItem: AutocompleteItem<T> = {
                            _isCustomValue: true,
                            label: query.trim(),
                            value: query.trim(),
                        }
                        handleSelect(customItem)
                        setQuery('')
                        inputRef?.current?.focus()
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
        const inputValue = e.target.value
        setQuery(inputValue)
        setIsOpen(true)
        setSelectedIndex(-1)
        isTypingRef.current = true
        if (mode === 'single' && keepInputValue) {
            onChange?.(inputValue)
        }
    }
    //Xóa từng tag item (multiple select)
    const handleRemove = (itemToRemove: AutocompleteItem<T>) => {
        if (mode === 'multiple') {
            const newSelectedItems = selectedItems.filter(
                (item) => item.value !== itemToRemove.value,
            )
            setSelectedItems(newSelectedItems)
            onChange?.(newSelectedItems)
        }
    }
    //Clear toàn bộ
    const handleClear = () => {
        setQuery('')

        if (mode === 'single') {
            setSelectedItem(null)
            onChange?.()
            onBlur?.()
        } else {
            setSelectedItems([])
            onChange?.([])
            onBlur?.([])
        }

        setIsOpen(false)
        setSelectedIndex(-1)
        inputRef.current?.focus()
        onClear?.()
    }

    /** hàm on blur */
    const handleBlur = () => {
        if (!isOpen) {
            switch (mode) {
                case 'single':
                    if (!keepInputValue) {
                        selectedItem
                            ? setQuery(selectedItem?.label)
                            : setQuery('')
                    }
                    isTypingRef.current = false
                    break
                case 'multiple':
                    setQuery('')
                    break
                default:
                    break
            }
        }
    }
    // Scroll selected item into view
    useEffect(() => {
        if (selectedIndex >= 0 && listRef.current) {
            const selectedElement = listRef.current.children[
                selectedIndex
            ] as HTMLElement
            if (selectedElement) {
                selectedElement.scrollIntoView({
                    block: 'nearest',
                    behavior: 'smooth',
                })
            }
        }
    }, [selectedIndex])

    return mode === 'multiple' ? (
        <Popover open={isOpen} onOpenChange={setIsOpen} modal={true}>
            <PopoverAnchor>
                <div className={cn('relative w-full', className)}>
                    <div
                        className={cn(
                            'flex w-full cursor-text flex-wrap items-center rounded-md border border-input bg-background px-3',
                            selectedItems.length > 0
                                ? 'py-1'
                                : 'py-2',
                        )}
                        onClick={() => {
                            inputRef.current?.focus()
                        }}>
                        {loading ? (
                            <Skeleton className=" h-5 w-[100%] bg-muted pr-10" />
                        ) : (
                            <>
                                {/** các tag được render ra */}
                                {maxTagPlaceholder ? (
                                    <Badge
                                        className="m-1"
                                        variant={
                                            'secondary'
                                        }>
                                        {maxTagPlaceholder?.()}
                                    </Badge>
                                ) : (
                                    selectedItems.map(
                                        (item) => (
                                            <Badge
                                                key={
                                                    item.value
                                                }
                                                className="m-1">
                                                <span>
                                                    {
                                                        item.label
                                                    }
                                                </span>
                                                {!disabled && (
                                                    <button
                                                        type="button"
                                                        onClick={(
                                                            e,
                                                        ) => {
                                                            e.stopPropagation()
                                                            handleRemove(
                                                                item,
                                                            )
                                                        }}
                                                        className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20">
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                )}
                                            </Badge>
                                        ),
                                    )
                                )}

                                {/** input search */}
                                <div className="flex min-w-[100px] flex-1 items-center">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={query}
                                        onChange={
                                            handleInputChange
                                        }
                                        onKeyDown={
                                            handleKeyDown
                                        }
                                        onFocus={() =>
                                            setIsOpen(
                                                true,
                                            )
                                        }
                                        placeholder={
                                            selectedItems.length ===
                                                0
                                                ? placeholder
                                                : ''
                                        }
                                        className="custom-input flex-1 border-transparent bg-transparent p-0 text-sm outline-none placeholder:text-muted-foreground focus:outline-none"
                                        autoComplete="off"
                                        onBlur={handleBlur}
                                        disabled={
                                            disabled ||
                                            loading
                                        }
                                    />
                                </div>
                                {/** nút xóa chung */}
                                {selectedItems.length > 0 &&
                                    allowClear &&
                                    !disabled && (
                                        <Button
                                            disabled={
                                                disabled
                                            }
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onMouseDown={(
                                                e,
                                            ) => {
                                                e.preventDefault()
                                                handleClear()
                                            }}
                                            className="h-6 w-6 flex-shrink-0 p-0 hover:bg-muted">
                                            <X className="h-3 w-3" />
                                        </Button>
                                    )}
                            </>
                        )}
                    </div>
                </div>
            </PopoverAnchor>
            <PopoverPortal>
                <PopoverContent
                    className="pointer-events-auto z-50 w-[var(--radix-popover-trigger-width)] rounded-md border bg-popover p-1 shadow-lg"
                    align="start"
                    sideOffset={4}
                    onOpenAutoFocus={(e) => e.preventDefault()}
                    onInteractOutside={(e) => {
                        // Prevent closing when clicking inside the input/anchor
                        if (
                            e.target === inputRef.current ||
                            inputRef.current?.contains(
                                e.target as Node,
                            )
                        ) {
                            e.preventDefault()
                        }
                    }}
                    style={{
                        padding: '2px',
                    }}>
                    <div className="pointer-events-auto max-h-60 overflow-y-auto">
                        <div ref={listRef}>
                            {getFilteredOptions().length > 0 ? (
                                getFilteredOptions().map(
                                    (item, index) => {
                                        const isSelected =
                                            selectedItems &&
                                            selectedItems.some(
                                                (x) =>
                                                    x.value ===
                                                    item.value,
                                            )
                                        return (
                                            <div
                                                key={
                                                    item.value
                                                }
                                                onClick={() =>
                                                    !item.disabled &&
                                                    handleSelect(
                                                        item,
                                                    )
                                                }
                                                className={cn(
                                                    item.disabled
                                                        ? 'cursor-not-allowed text-gray-200 hover:bg-transparent dark:text-gray-500 '
                                                        : 'cursor-pointer hover:bg-gray-200 dark:hover:bg-accent',
                                                    'flex  items-center justify-between rounded-sm px-3 py-2 text-sm transition-colors ',
                                                    index ===
                                                    selectedIndex &&
                                                    !item.disabled &&
                                                    'bg-gray-200 text-accent-foreground dark:bg-accent dark:text-white dark:hover:bg-accent',
                                                    isSelected &&
                                                    'bg-primary/10 dark:bg-gray-300 dark:text-black dark:hover:text-white',
                                                )}>
                                                {optionRender ? (
                                                    optionRender(
                                                        item,
                                                    )
                                                ) : (
                                                    <div className="min-w-0 flex-1">
                                                        <div className="truncate font-medium">
                                                            {
                                                                item.label
                                                            }
                                                        </div>
                                                    </div>
                                                )}

                                                {isSelected && (
                                                    <Check className="ml-2 h-4 w-4 flex-shrink-0 text-primary dark:text-black dark:hover:text-white" />
                                                )}
                                            </div>
                                        )
                                    },
                                )
                            ) : query.trim() ? (
                                <div className="px-3 py-2 text-sm text-muted-foreground">
                                    <div className="flex flex-col items-center gap-1 px-3 py-2 text-center text-sm text-muted-foreground">
                                        <Inbox className="text-gray-500" />
                                        <div>
                                            Không tìm thấy
                                            kết quả
                                        </div>
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
                </PopoverContent>
            </PopoverPortal>
        </Popover>
    ) : (
        <Popover open={isOpen} onOpenChange={setIsOpen} modal={true}>
            <PopoverAnchor>
                <div className="relative">
                    {loading && (
                        <Skeleton className="absolute left-2 top-2 z-10 h-5 w-[98%] bg-muted pr-10" />
                    )}
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
                        placeholder={loading ? '' : placeholder}
                        className="pl-10 pr-10"
                        autoComplete="off"
                        onBlur={handleBlur}
                        disabled={disabled || loading}
                        id={id}
                    />
                    {!query && !loading && (
                        <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                    )}

                    {query && allowClear && !disabled && !loading && (
                        <Button
                            disabled={disabled || loading}
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleClear}
                            data-autocomplete-clear="true"
                            className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 transform p-0 hover:bg-muted">
                            <X className="h-3 w-3" />
                        </Button>
                    )}
                </div>
            </PopoverAnchor>
            <PopoverPortal>
                <PopoverContent
                    className="pointer-events-auto z-50 w-[var(--radix-popover-trigger-width)] rounded-md border bg-popover p-1 shadow-lg"
                    align="start"
                    sideOffset={4}
                    onOpenAutoFocus={(e) => e.preventDefault()}
                    onInteractOutside={(e) => {
                        // Prevent closing when clicking inside the input/anchor
                        if (
                            e.target === inputRef.current ||
                            inputRef.current?.contains(
                                e.target as Node,
                            )
                        ) {
                            e.preventDefault()
                        }
                    }}
                    style={{
                        padding: '2px',
                    }}>
                    <div className="pointer-events-auto max-h-60 overflow-y-auto">
                        <div ref={listRef}>
                            {getFilteredOptions().length > 0 ? (
                                getFilteredOptions().map(
                                    (item, index) => (
                                        <div
                                            key={
                                                item.value
                                            }
                                            onClick={() =>
                                                !item.disabled &&
                                                handleSelect(
                                                    item,
                                                )
                                            }
                                            className={cn(
                                                item.disabled
                                                    ? 'cursor-not-allowed text-gray-200 hover:bg-transparent dark:text-gray-500 '
                                                    : 'cursor-pointer hover:bg-gray-200 dark:hover:bg-accent',
                                                'flex  items-center justify-between rounded-sm px-3 py-2 text-sm transition-colors ',
                                                index ===
                                                selectedIndex &&
                                                !item.disabled &&
                                                'bg-gray-200 text-accent-foreground dark:bg-accent dark:text-white dark:hover:bg-accent',
                                                selectedItem?.value ===
                                                item.value &&
                                                'bg-primary/10 dark:bg-gray-300 dark:text-black dark:hover:text-white',
                                            )}>
                                            {optionRender ? (
                                                optionRender(
                                                    item,
                                                )
                                            ) : (
                                                <div className="min-w-0 flex-1">
                                                    <div className="truncate font-medium">
                                                        {
                                                            item.label
                                                        }
                                                    </div>
                                                </div>
                                            )}

                                            {selectedItem?.value ===
                                                item.value && (
                                                    <Check className="ml-2 h-4 w-4 flex-shrink-0 text-primary dark:text-black dark:hover:text-white" />
                                                )}
                                        </div>
                                    ),
                                )
                            ) : query.trim() ? (
                                <div className="px-3 py-2 text-sm text-muted-foreground">
                                    <div className="flex flex-col items-center gap-1 px-3 py-2 text-center text-sm text-muted-foreground">
                                        <Inbox className="text-gray-500" />
                                        <div>
                                            Không tìm thấy
                                            kết quả
                                        </div>
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
                </PopoverContent>
            </PopoverPortal>
        </Popover>
    )
}
