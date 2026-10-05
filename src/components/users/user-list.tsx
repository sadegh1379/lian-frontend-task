import { Trash2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { User } from "@/features/users/schema"

type UserListProps = {
  users: readonly User[]
  disabled: boolean
  onDelete: (user: User) => void
}

export function UserList({ users, disabled, onDelete }: UserListProps) {
  return (
    <>
      <div className="flex flex-col gap-3 md:hidden">
        {users.map((user) => (
          <Card key={user.id} size="sm">
            <CardHeader>
              <CardTitle className="truncate">{user.name}</CardTitle>
              <CardAction>
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
              <TableHead className="px-4">Name</TableHead>
              <TableHead className="px-4">Email</TableHead>
              <TableHead className="px-4">Company</TableHead>
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
