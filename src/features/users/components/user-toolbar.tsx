import { ArrowDownIcon, ArrowUpIcon, SearchIcon, XIcon } from "lucide-react"

import { AddUserDialog } from "@/features/users/components/add-user-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { CreateUserInput } from "@/features/users/lib/schema"
import type { SortDirection, SortField } from "@/features/users/lib/types"

type UserToolbarProps = {
  query: string
  onQueryChange: (query: string) => void
  sortField: SortField
  onSortFieldChange: (field: SortField) => void
  sortDirection: SortDirection
  onSortDirectionChange: (direction: SortDirection) => void
  totalCount: number
  visibleCount: number
  canMutate: boolean
  onAdd: (input: CreateUserInput) => Promise<void>
}

const sortOptions: { value: SortField; label: string }[] = [
  { value: "id", label: "User ID" },
  { value: "name", label: "Name" },
  { value: "username", label: "Username" },
]

function isSortField(value: string): value is SortField {
  return sortOptions.some((option) => option.value === value)
}

export function UserToolbar({
  query,
  onQueryChange,
  sortField,
  onSortFieldChange,
  sortDirection,
  onSortDirectionChange,
  totalCount,
  visibleCount,
  canMutate,
  onAdd,
}: UserToolbarProps) {
  const countLabel =
    query.trim().length > 0
      ? `${visibleCount} of ${totalCount} users`
      : `${totalCount} users`

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => {
              onQueryChange(event.target.value)
            }}
            placeholder="Search by name or email"
            aria-label="Search by name or email"
            className="pr-8 pl-8"
          />
          {query ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className="absolute top-1/2 right-1.5 -translate-y-1/2"
              onClick={() => {
                onQueryChange("")
              }}
              aria-label="Clear search"
            >
              <XIcon />
            </Button>
          ) : null}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Select
            value={sortField}
            onValueChange={(value) => {
              if (isSortField(value)) {
                onSortFieldChange(value)
              }
            }}
          >
            <SelectTrigger className="w-full sm:w-40" aria-label="Sort users">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            aria-label={
              sortDirection === "asc"
                ? "Sorted ascending. Switch to descending."
                : "Sorted descending. Switch to ascending."
            }
            onClick={() => {
              onSortDirectionChange(sortDirection === "asc" ? "desc" : "asc")
            }}
          >
            {sortDirection === "asc" ? <ArrowUpIcon /> : <ArrowDownIcon />}
            {sortDirection === "asc" ? "Ascending" : "Descending"}
          </Button>
          <AddUserDialog disabled={!canMutate} onAdd={onAdd} />
        </div>
      </div>
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {countLabel}
      </p>
    </div>
  )
}
