import { userMutationsStorageKey } from "@/features/users/constants"
import { userMutationsSchema } from "@/features/users/lib/schema"
import type { UserMutations } from "@/features/users/types"

const emptyMutations: UserMutations = {
  created: [],
  deletedIds: [],
}

export function readMutations(): UserMutations {
  try {
    const raw = localStorage.getItem(userMutationsStorageKey)

    if (!raw) {
      return emptyMutations
    }

    const parsed = userMutationsSchema.safeParse(JSON.parse(raw) as unknown)
    return parsed.success ? parsed.data : emptyMutations
  } catch {
    return emptyMutations
  }
}

export function writeMutations(mutations: UserMutations): void {
  localStorage.setItem(userMutationsStorageKey, JSON.stringify(mutations))
}
