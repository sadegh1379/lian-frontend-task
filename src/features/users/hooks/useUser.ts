import { useQuery } from "@tanstack/react-query"

import { fetchUser } from "@/features/users/api"
import { ApiError } from "@/lib/http"
import { userKeys } from "@/features/users/lib/query-keys"
import type { User } from "@/features/users/lib/schema"
import { readMutations } from "@/features/users/lib/storage"

async function loadUser(id: number): Promise<User> {
  const mutations = readMutations()

  if (mutations.deletedIds.includes(id)) {
    throw new ApiError("This user could not be found.")
  }

  const createdUser = mutations.created.find((user) => user.id === id)

  if (createdUser) {
    return createdUser
  }

  return fetchUser(id)
}

export function useUser(id: number, enabled: boolean) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => loadUser(id),
    enabled,
  })
}
