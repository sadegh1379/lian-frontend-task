import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/shared/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog"
import type { User } from "@/features/users/types"

type DeleteUserDialogProps = {
  user: User | null
  onClose: () => void
  onConfirm: (id: number) => Promise<void>
}

export function DeleteUserDialog({
  user,
  onClose,
  onConfirm,
}: DeleteUserDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleOpenChange = (open: boolean) => {
    if (!open && !isDeleting) {
      onClose()
    }
  }

  const handleConfirm = async () => {
    if (!user) {
      return
    }

    setIsDeleting(true)

    try {
      await onConfirm(user.id)
      toast.success(`${user.name} was deleted.`)
      onClose()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not delete the user."
      toast.error(message)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={user !== null} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete user {user?.id}</DialogTitle>
          <DialogDescription>
            {user
              ? `${user.name} will be removed from this directory. The deletion is sent to the API and kept on this device after refresh.`
              : "This user will be removed from the directory."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              void handleConfirm()
            }}
            disabled={isDeleting || user === null}
          >
            {isDeleting ? "Deleting..." : "Delete user"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
