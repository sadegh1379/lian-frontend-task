import { ArrowLeftIcon, TriangleAlertIcon } from "lucide-react"
import { useEffect } from "react"
import { Link, useParams } from "react-router-dom"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatAddress } from "@/features/users/format-address"
import type { User } from "@/features/users/schema"
import { useUser } from "@/features/users/use-user"

function displayValue(value: string): string {
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : "—"
}

function BackToUsers() {
  return (
    <Button variant="ghost" className="-ml-2 w-fit" asChild>
      <Link to="/">
        <ArrowLeftIcon data-icon="inline-start" />
        Back to users
      </Link>
    </Button>
  )
}

function UserDetailSkeleton() {
  return (
    <div aria-busy="true" aria-live="polite" className="flex flex-col gap-4">
      <span className="sr-only">Loading user details</span>
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-72 w-full rounded-xl" />
    </div>
  )
}

type UserDetailErrorProps = {
  message: string
  onRetry?: () => void
}

function UserDetailError({ message, onRetry }: UserDetailErrorProps) {
  return (
    <Alert variant="destructive">
      <TriangleAlertIcon />
      <AlertTitle>Could not load this user</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
      {onRetry ? (
        <div className="col-start-2 pt-2">
          <Button type="button" variant="outline" size="sm" onClick={onRetry}>
            Retry
          </Button>
        </div>
      ) : null}
    </Alert>
  )
}

function UserDetailCard({ user }: { user: User }) {
  const fields = [
    { label: "Name", value: user.name },
    { label: "Username", value: user.username },
    { label: "Email", value: user.email },
    { label: "Phone", value: user.phone },
    { label: "Address", value: formatAddress(user.address) },
    { label: "Company name", value: user.company.name },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>{displayValue(user.name)}</CardTitle>
        <CardDescription>User {user.id}</CardDescription>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-4 sm:grid-cols-2">
          {fields.map((field) => (
            <div key={field.label} className="grid gap-1">
              <dt className="text-sm text-muted-foreground">{field.label}</dt>
              <dd className="text-sm font-medium break-words">
                {displayValue(field.value)}
              </dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  )
}

export function UserDetailPage() {
  const { id: idParam } = useParams()
  const id = Number(idParam)
  const isValidId = Number.isInteger(id) && id > 0
  const userQuery = useUser(id, isValidId)
  const user = userQuery.data

  useEffect(() => {
    document.title = user ? `${user.name} · Users` : "User details"
    return () => {
      document.title = "Users"
    }
  }, [user])

  const errorMessage =
    userQuery.error instanceof Error
      ? userQuery.error.message
      : "Could not load this user. Try again."

  return (
    <div className="min-h-svh bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 px-4 py-5 sm:px-6">
          <BackToUsers />
          <div>
            <p className="text-sm text-muted-foreground">Directory</p>
            <h1 className="text-xl font-medium tracking-tight sm:text-2xl">
              User details
            </h1>
          </div>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-6 sm:px-6">
        {!isValidId ? (
          <UserDetailError message="This user could not be found." />
        ) : null}
        {isValidId && userQuery.isLoading ? <UserDetailSkeleton /> : null}
        {isValidId && userQuery.isError ? (
          <UserDetailError
            message={errorMessage}
            onRetry={() => {
              void userQuery.refetch()
            }}
          />
        ) : null}
        {user ? <UserDetailCard user={user} /> : null}
      </main>
    </div>
  )
}
