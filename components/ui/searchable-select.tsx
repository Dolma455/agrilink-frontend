"use client"

import { useMemo, useState } from "react"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface SearchableSelectOption {
  value: string
  label: string
  meta?: any
}

interface SearchableSelectProps {
  value: string | undefined
  onChange: (val: string) => void
  options: SearchableSelectOption[]
  placeholder?: string
  emptyMessage?: string
  className?: string
  maxHeight?: number
  searchable?: boolean
}

export function SearchableSelect({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  emptyMessage = "No options",
  className,
  maxHeight = 260,
  searchable = true,
}: SearchableSelectProps) {
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    if (!query.trim()) return options
    const q = query.toLowerCase()
    return options.filter(o => o.label.toLowerCase().includes(q))
  }, [options, query])

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={cn("w-full", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="p-0">
        {searchable && (
          <div className="p-2 border-b sticky top-0 bg-popover">
            <Input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search..."
              className="h-8"
              autoFocus
            />
          </div>
        )}
        <div className="max-h-[var(--ss-max-height)] overflow-y-auto" style={{"--ss-max-height": `${maxHeight}px`} as any}>
          {filtered.length > 0 ? (
            filtered.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))
          ) : (
            <div className="text-muted-foreground text-sm p-3">{emptyMessage}</div>
          )}
        </div>
      </SelectContent>
    </Select>
  )
}
