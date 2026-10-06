import type { CreateUserInput, User, UserMutations } from "@/features/users/lib/schema"
import type { SortDirection, SortField } from "@/features/users/types"

export function mergeUsers(
  remoteUsers: readonly User[],
  mutations: UserMutations,
): User[] {
  const deletedIds = new Set(mutations.deletedIds)
  const remote = remoteUsers.filter((user) => !deletedIds.has(user.id))
  const created = mutations.created.filter((user) => !deletedIds.has(user.id))

  return [...remote, ...created]
}

export function nextUserId(
  remoteUsers: readonly User[],
  mutations: UserMutations,
): number {
  const ids = [
    ...remoteUsers.map((user) => user.id),
    ...mutations.created.map((user) => user.id),
    ...mutations.deletedIds,
  ]

  return ids.reduce((maxId, id) => Math.max(maxId, id), 0) + 1
}

export function buildCreatedUser(id: number, input: CreateUserInput): User {
  return {
    id,
    name: input.name,
    username: "",
    email: input.email,
    phone: "",
    website: "",
    address: {
      street: "",
      suite: "",
      city: "",
      zipcode: "",
      geo: { lat: "", lng: "" },
    },
    company: {
      name: input.companyName,
      catchPhrase: "",
      bs: "",
    },
  }
}

export function queryUsers(
  users: readonly User[],
  query: string,
  sortField: SortField,
  sortDirection: SortDirection,
): User[] {
  const normalizedQuery = query.trim().toLowerCase()
  const filtered = normalizedQuery
    ? users.filter((user) => {
        const nameMatches = user.name.toLowerCase().includes(normalizedQuery)
        const emailMatches = user.email.toLowerCase().includes(normalizedQuery)
        return nameMatches || emailMatches
      })
    : [...users]

  const direction = sortDirection === "asc" ? 1 : -1

  return filtered.sort((left, right) => {
    return compareSortValues(left, right, sortField) * direction
  })
}

function sortValue(user: User, sortField: SortField): string {
  if (sortField === "company") {
    return user.company.name
  }

  return user[sortField]
}

function compareSortValues(left: User, right: User, sortField: SortField): number {
  return sortValue(left, sortField).localeCompare(sortValue(right, sortField), undefined, {
    sensitivity: "base",
  })
}
