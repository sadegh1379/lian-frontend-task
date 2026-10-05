import { Skeleton } from "@/components/ui/skeleton"

export function UserListSkeleton() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading users</span>
      <div className="flex flex-col gap-3 md:hidden">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-28 w-full rounded-xl" />
        ))}
      </div>
      <Skeleton className="hidden h-96 w-full rounded-xl md:block" />
    </div>
  )
}
