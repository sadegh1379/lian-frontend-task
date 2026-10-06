import { SearchXIcon, TriangleAlertIcon, type LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type ErrorStateProps = {
  title: string
  message: string
  onRetry?: () => void
}

export function ErrorState({ title, message, onRetry }: ErrorStateProps) {
  return (
    <Alert variant="destructive">
      <TriangleAlertIcon />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
      {onRetry ? (
        <AlertAction>
          <Button type="button" variant="outline" size="sm" onClick={onRetry}>
            Retry
          </Button>
        </AlertAction>
      ) : null}
    </Alert>
  )
}

type EmptyStateProps = {
  icon: LucideIcon
  title: string
  description: ReactNode
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <Card>
      <CardHeader className="items-center text-center">
        <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Icon />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        {action ? (
          <Button type="button" variant="outline" onClick={action.onClick}>
            {action.label}
          </Button>
        ) : null}
      </CardHeader>
    </Card>
  )
}

type NoResultsStateProps = {
  title?: string
  description: ReactNode
  onClear: () => void
  clearLabel?: string
}

export function NoResultsState({
  title = "No results",
  description,
  onClear,
  clearLabel = "Clear search",
}: NoResultsStateProps) {
  return (
    <EmptyState
      icon={SearchXIcon}
      title={title}
      description={description}
      action={{ label: clearLabel, onClick: onClear }}
    />
  )
}
