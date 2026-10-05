import { SearchXIcon, TriangleAlertIcon, UsersIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

type UsersErrorStateProps = {
  message: string
  onRetry: () => void
}

export function UsersErrorState({ message, onRetry }: UsersErrorStateProps) {
  return (
    <Alert variant="destructive">
      <TriangleAlertIcon />
      <AlertTitle>Could not load users</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
      <AlertAction>
        <Button type="button" variant="outline" size="sm" onClick={onRetry}>
          Retry
        </Button>
      </AlertAction>
    </Alert>
  )
}

export function UsersEmptyState() {
  return (
    <Card>
      <CardHeader className="items-center text-center">
        <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <UsersIcon />
        </div>
        <CardTitle>No users</CardTitle>
        <CardDescription>
          The directory is empty. Add a user to see them here. Added users stay
          on this device after refresh.
        </CardDescription>
      </CardHeader>
    </Card>
  )
}

type UsersNoResultsProps = {
  query: string
  onClear: () => void
}

export function UsersNoResults({ query, onClear }: UsersNoResultsProps) {
  return (
    <Card>
      <CardHeader className="items-center text-center">
        <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <SearchXIcon />
        </div>
        <CardTitle>No matching users</CardTitle>
        <CardDescription>
          Nothing matches “{query.trim()}”. Try another name or user ID.
        </CardDescription>
        <Button type="button" variant="outline" onClick={onClear}>
          Clear search
        </Button>
      </CardHeader>
    </Card>
  )
}
