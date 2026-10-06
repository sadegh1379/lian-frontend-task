import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon, Trash2Icon } from "lucide-react"
import { Link } from "react-router-dom"

import { Button } from "@/shared/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table"
import { cn } from "@/shared/lib/utils"
import type { SortDirection, SortField, User } from "@/features/users/types"

const columns: { field: SortField; label: string }[] = [
  { field: "name", label: "Name" },
  { field: "email", label: "Email" },
  { field: "company", label: "Company" },
]

type UserListProps = {
  users: readonly User[]
  disabled: boolean
  sortField: SortField
  sortDirection: SortDirection
  onSort: (field: SortField) => void
  onDelete: (user: User) => void
}

type SortColumnButtonProps = {
  field: SortField
  label: string
  sortField: SortField
  sortDirection: SortDirection
  onSort: (field: SortField) => void
  className?: string
}

function SortColumnButton({
  field,
  label,
  sortField,
  sortDirection,
  onSort,
  className,
}: SortColumnButtonProps) {
  const active = sortField === field
  const DirectionIcon = sortDirection === "asc" ? ArrowUpIcon : ArrowDownIcon

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={cn("-ml-2", className)}
      aria-label={
        active
          ? `${label}, sorted ${sortDirection === "asc" ? "ascending" : "descending"}`
          : `Sort by ${label}`
      }
      onClick={() => {
        onSort(field)
      }}
    >
      {label}
      {active ? <DirectionIcon /> : <ArrowUpDownIcon className="text-muted-foreground" />}
    </Button>
  )
}

export function UserList({
  users,
  disabled,
  sortField,
  sortDirection,
  onSort,
  onDelete,
}: UserListProps) {
  return (
    <>
      <div
        className="flex flex-wrap gap-1 md:hidden"
        role="group"
        aria-label="Sort users"
      >
        {columns.map((column) => (
          <SortColumnButton
            key={column.field}
            field={column.field}
            label={column.label}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={onSort}
            className="ml-0"
          />
        ))}
      </div>
      <div className="flex flex-col gap-3 md:hidden">
        {users.map((user) => (
          <Card key={user.id} size="sm">
            <CardHeader>
              <CardTitle className="truncate">{user.name}</CardTitle>
              <CardAction className="flex gap-1">
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/users/${user.id}`}>Details</Link>
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon-sm"
                  disabled={disabled}
                  aria-label={`Delete ${user.name}`}
                  onClick={() => {
                    onDelete(user)
                  }}
                >
                  <Trash2Icon />
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Email</span>
                <span className="truncate font-medium">{user.email || "—"}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Company</span>
                <span className="truncate font-medium">
                  {user.company.name || "—"}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="hidden overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10 md:block">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.field}
                  className="px-4"
                  aria-sort={
                    sortField === column.field
                      ? sortDirection === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                >
                  <SortColumnButton
                    field={column.field}
                    label={column.label}
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={onSort}
                  />
                </TableHead>
              ))}
              <TableHead className="px-4 text-right">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="max-w-xs px-4 font-medium">
                  <span className="block truncate">{user.name}</span>
                </TableCell>
                <TableCell className="max-w-xs px-4">
                  <span className="block truncate">{user.email || "—"}</span>
                </TableCell>
                <TableCell className="max-w-xs px-4">
                  <span className="block truncate">{user.company.name || "—"}</span>
                </TableCell>
                <TableCell className="px-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/users/${user.id}`}>Details</Link>
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      disabled={disabled}
                      aria-label={`Delete ${user.name}`}
                      onClick={() => {
                        onDelete(user)
                      }}
                    >
                      <Trash2Icon />
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
