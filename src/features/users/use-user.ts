import { useQuery } from "@tanstack/react-query"

import { ApiError, fetchUser } from "@/features/users/api"
import { userKeys } from "@/features/users/query-keys"
import type { User } from "@/features/users/schema"
import { readMutations } from "@/features/users/storage"

async function loadUser(id: number, signal?: AbortSignal): Promise<User> {
  const mutations = readMutations()

  if (mutations.deletedIds.includes(id)) {
    throw new ApiError("This user could not be found.")
  }

  const createdUser = mutations.created.find((user) => user.id === id)

  if (createdUser) {
    return createdUser
  }

  return fetchUser(id, signal)
}

export function useUser(id: number, enabled: boolean) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: ({ signal }) => loadUser(id, signal),
    enabled,
  })
}
