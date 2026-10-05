import { UsersIcon } from "lucide-react"
import { useMemo, useState } from "react"

import { ThemeToggle } from "@/components/theme-toggle"
import { DeleteUserDialog } from "@/features/users/components/delete-user-dialog"
import { UserList } from "@/features/users/components/user-list"
import { UserListSkeleton } from "@/features/users/components/user-list-skeleton"
import { UserToolbar } from "@/features/users/components/user-toolbar"
import {
  UsersEmptyState,
  UsersErrorState,
  UsersNoResults,
} from "@/features/users/components/users-state"
import { useUsers } from "@/features/users/hooks/use-users"
import { queryUsers } from "@/features/users/lib/directory"
import type { User } from "@/features/users/lib/schema"
import type { SortDirection, SortField } from "@/features/users/lib/types"

export function DashboardPage() {
  const { status, errorMessage, users, isMutating, reload, addUser, removeUser } =
    useUsers()
  const [query, setQuery] = useState("")
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [userToDelete, setUserToDelete] = useState<User | null>(null)

  const visibleUsers = useMemo(
    () => queryUsers(users, query, sortField, sortDirection),
    [users, query, sortField, sortDirection],
  )

  const hasQuery = query.trim().length > 0

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
          totalCount={users.length}
          visibleCount={visibleUsers.length}
          canMutate={status === "ready" && !isMutating}
          onAdd={addUser}
        />
        {status === "loading" ? <UserListSkeleton /> : null}
        {status === "error" ? (
          <UsersErrorState
            message={errorMessage ?? "Could not load users. Try again."}
            onRetry={reload}
          />
        ) : null}
        {status === "ready" && users.length === 0 ? <UsersEmptyState /> : null}
        {status === "ready" && users.length > 0 && visibleUsers.length === 0 && hasQuery ? (
          <UsersNoResults
            query={query}
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
