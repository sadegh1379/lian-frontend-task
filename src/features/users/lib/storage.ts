import {
  userMutationsSchema,
  type UserMutations,
} from "@/features/users/schema"

const storageKey = "lian.user-mutations"

const emptyMutations: UserMutations = {
  created: [],
  deletedIds: [],
}

export function readMutations(): UserMutations {
  try {
    const raw = localStorage.getItem(storageKey)

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
  localStorage.setItem(storageKey, JSON.stringify(mutations))
}
