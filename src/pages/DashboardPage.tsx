import { UsersIcon } from "lucide-react"
import { useMemo, useState } from "react"

import { EmptyState, ErrorState, NoResultsState } from "@/components/states"
import { ThemeToggle } from "@/components/theme-toggle"
import { DeleteUserDialog } from "@/features/users/components/delete-user-dialog"
import { UserList } from "@/features/users/components/user-list"
import { UserListSkeleton } from "@/features/users/components/user-list-skeleton"
import { UserToolbar } from "@/features/users/components/user-toolbar"
import { useDebouncedValue } from "@/features/users/hooks/use-debounced-value"
import { useUsers } from "@/features/users/hooks/use-users"
import { queryUsers } from "@/features/users/lib/directory"
import type { User } from "@/features/users/lib/schema"
import type { SortDirection, SortField } from "@/features/users/types"

const searchDebounceMs = 300

export function DashboardPage() {
  const { status, errorMessage, users, isMutating, reload, addUser, removeUser } =
    useUsers()
  const [query, setQuery] = useState("")
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const filterQuery = useDebouncedValue(
    query,
    query.trim().length === 0 ? 0 : searchDebounceMs,
  )

  const visibleUsers = useMemo(
    () => queryUsers(users, filterQuery, sortField, sortDirection),
    [users, filterQuery, sortField, sortDirection],
  )

  const hasQuery = filterQuery.trim().length > 0

  function handleSort(field: SortField) {
    if (field === sortField) {
      setSortDirection((direction) => (direction === "asc" ? "desc" : "asc"))
      return
    }

    setSortField(field)
    setSortDirection("asc")
  }

  return (
    <div className="min-h-svh bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-5 sm:px-6">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <UsersIcon className="size-4" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Directory</p>
            <h1 className="text-xl font-medium tracking-tight sm:text-2xl">
              Users
            </h1>
          </div>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-6 sm:px-6">
        <UserToolbar
          query={query}
          onQueryChange={setQuery}
          filterQuery={filterQuery}
          totalCount={users.length}
          visibleCount={visibleUsers.length}
          canMutate={status === "ready" && !isMutating}
          onAdd={addUser}
        />
        {status === "loading" ? <UserListSkeleton /> : null}
        {status === "error" ? (
          <ErrorState
            title="Could not load users"
            message={errorMessage ?? "Could not load users. Try again."}
            onRetry={reload}
          />
        ) : null}
        {status === "ready" && users.length === 0 ? (
          <EmptyState
            icon={UsersIcon}
            title="No users"
            description="The directory is empty. Add a user to see them here. Added users stay on this device after refresh."
          />
        ) : null}
        {status === "ready" && users.length > 0 && visibleUsers.length === 0 && hasQuery ? (
          <NoResultsState
            title="No matching users"
            description={`Nothing matches “${filterQuery.trim()}”. Try another name or email.`}
            onClear={() => {
              setQuery("")
            }}
          />
        ) : null}
        {status === "ready" && visibleUsers.length > 0 ? (
          <UserList
            users={visibleUsers}
            disabled={isMutating}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            onDelete={setUserToDelete}
          />
        ) : null}
        <p role="status" className="text-xs text-muted-foreground">
          Added and deleted users are saved on this device and kept after
          refresh. Search and sort run on the loaded list.
        </p>
      </main>
      <DeleteUserDialog
        user={userToDelete}
        onClose={() => {
          setUserToDelete(null)
        }}
        onConfirm={removeUser}
      />
    </div>
  )
}
