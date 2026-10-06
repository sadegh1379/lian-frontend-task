import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const rowCount = 5

const cellWidths = ["w-32", "w-48", "w-28"] as const

export function UserListSkeleton() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading users</span>
      <div className="flex flex-col gap-3 md:hidden">
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} className="h-24 w-full rounded-xl" />
        ))}
      </div>
      <div className="hidden overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10 md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-4">
                <Skeleton className="h-4 w-14" />
              </TableHead>
              <TableHead className="px-4">
                <Skeleton className="h-4 w-12" />
              </TableHead>
              <TableHead className="px-4">
                <Skeleton className="h-4 w-16" />
              </TableHead>
              <TableHead className="px-4 text-right">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rowCount }, (_, rowIndex) => (
              <TableRow key={rowIndex}>
                {cellWidths.map((width) => (
                  <TableCell key={width} className="px-4">
                    <Skeleton className={`h-4 ${width}`} />
                  </TableCell>
                ))}
                <TableCell className="px-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
