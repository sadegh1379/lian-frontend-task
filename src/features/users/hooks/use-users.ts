import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useMemo } from "react"

import {
  createUserRequest,
  deleteUserRequest,
  fetchUsers,
} from "@/features/users/api"
import {
  buildCreatedUser,
  mergeUsers,
  nextUserId,
} from "@/features/users/lib/directory"
import { userKeys } from "@/features/users/lib/query-keys"
import type { CreateUserInput, User, UserMutations } from "@/features/users/lib/schema"
import { readMutations, writeMutations } from "@/features/users/lib/storage"

type UsersStatus = "loading" | "error" | "ready"

type UseUsersResult = {
  status: UsersStatus
  errorMessage: string | null
  users: User[]
  isMutating: boolean
  reload: () => void
  addUser: (input: CreateUserInput) => Promise<void>
  removeUser: (id: number) => Promise<void>
}

const emptyMutations: UserMutations = {
  created: [],
  deletedIds: [],
}

function toErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return "Could not load users. Try again."
}

export function useUsers(): UseUsersResult {
  const queryClient = useQueryClient()
  const usersQuery = useQuery({
    queryKey: userKeys.remote,
    queryFn: fetchUsers,
  })
  const mutationsQuery = useQuery({
    queryKey: userKeys.mutations,
    queryFn: readMutations,
    initialData: readMutations(),
    staleTime: Infinity,
  })

  const addMutation = useMutation({
    mutationFn: async (input: CreateUserInput) => {
      await createUserRequest(input)
      return input
    },
    onSuccess: (input) => {
      queryClient.setQueryData<UserMutations>(userKeys.mutations, (current) => {
        const mutations = current ?? readMutations()
        const remoteUsers =
          queryClient.getQueryData<User[]>(userKeys.remote) ?? []
        const nextMutations: UserMutations = {
          created: [
            ...mutations.created,
            buildCreatedUser(nextUserId(remoteUsers, mutations), input),
          ],
          deletedIds: mutations.deletedIds,
        }
        writeMutations(nextMutations)
        return nextMutations
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const mutations =
        queryClient.getQueryData<UserMutations>(userKeys.mutations) ??
        readMutations()
      const isLocalUser = mutations.created.some((user) => user.id === id)

      if (!isLocalUser) {
        await deleteUserRequest(id)
      }

      return { id, isLocalUser }
    },
    onSuccess: ({ id, isLocalUser }) => {
      queryClient.setQueryData<UserMutations>(userKeys.mutations, (current) => {
        const mutations = current ?? readMutations()
        const nextMutations: UserMutations = {
          created: mutations.created.filter((user) => user.id !== id),
          deletedIds:
            isLocalUser || mutations.deletedIds.includes(id)
              ? mutations.deletedIds
              : [...mutations.deletedIds, id],
        }
        writeMutations(nextMutations)
        return nextMutations
      })
    },
  })

  const mutations = mutationsQuery.data ?? emptyMutations
  const users = useMemo(
    () => (usersQuery.data ? mergeUsers(usersQuery.data, mutations) : []),
    [usersQuery.data, mutations],
  )

  const isReloading = usersQuery.isFetching && usersQuery.isError
  const status: UsersStatus = usersQuery.isPending || isReloading
    ? "loading"
    : usersQuery.isError
      ? "error"
      : "ready"

  return {
    status,
    errorMessage: usersQuery.error ? toErrorMessage(usersQuery.error) : null,
    users,
    isMutating: addMutation.isPending || deleteMutation.isPending,
    reload: () => {
      void usersQuery.refetch()
    },
    addUser: async (input) => {
      await addMutation.mutateAsync(input)
    },
    removeUser: async (id) => {
      await deleteMutation.mutateAsync(id)
    },
  }
}
