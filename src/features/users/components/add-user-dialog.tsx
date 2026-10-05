import { zodResolver } from "@hookform/resolvers/zod"
import { PlusIcon } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  createUserSchema,
  type CreateUserInput,
} from "@/features/users/schema"

type AddUserDialogProps = {
  disabled: boolean
  onAdd: (input: CreateUserInput) => Promise<void>
}

const emptyUser: CreateUserInput = {
  name: "",
  email: "",
  companyName: "",
}

export function AddUserDialog({ disabled, onAdd }: AddUserDialogProps) {
  const [open, setOpen] = useState(false)
  const form = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: emptyUser,
  })

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && form.formState.isSubmitting) {
      return
    }

    setOpen(nextOpen)

    if (!nextOpen) {
      form.reset(emptyUser)
    }
  }

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await onAdd(values)
      toast.success(`${values.name} was added.`)
      form.reset(emptyUser)
      setOpen(false)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not add the user."
      toast.error(message)
    }
  })

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button type="button" disabled={disabled}>
          <PlusIcon data-icon="inline-start" />
          Add user
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add user</DialogTitle>
          <DialogDescription>
            The user is sent to the API, then saved on this device so it stays
            after refresh.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} className="grid gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      autoComplete="name"
                      placeholder="Leanne Graham"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      autoComplete="email"
                      placeholder="leanne@example.com"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      autoComplete="organization"
                      placeholder="Romaguera-Crona"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  disabled={form.formState.isSubmitting}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Adding..." : "Add user"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
