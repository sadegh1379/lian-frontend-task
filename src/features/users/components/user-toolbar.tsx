import { SearchIcon, XIcon } from "lucide-react"

import { AddUserDialog } from "@/features/users/components/add-user-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { CreateUserInput } from "@/features/users/lib/schema"

type UserToolbarProps = {
  query: string
  onQueryChange: (query: string) => void
  totalCount: number
  visibleCount: number
  canMutate: boolean
  onAdd: (input: CreateUserInput) => Promise<void>
}

export function UserToolbar({
  query,
  onQueryChange,
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
        <AddUserDialog disabled={!canMutate} onAdd={onAdd} />
      </div>
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {countLabel}
      </p>
    </div>
  )
}
