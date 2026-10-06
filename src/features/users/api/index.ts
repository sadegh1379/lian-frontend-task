import { ApiError, request } from "@/lib/http"

import {
  userListSchema,
  userSchema,
  type CreateUserInput,
  type User,
} from "@/features/users/lib/schema"

const usersEndpoint = "https://jsonplaceholder.typicode.com/users"

export async function fetchUsers(): Promise<User[]> {
  const response = await request(usersEndpoint)

  if (!response.ok) {
    throw new ApiError("Could not load users. Try again.")
  }

  const payload: unknown = await response.json()
  const parsed = userListSchema.safeParse(payload)

  if (!parsed.success) {
    throw new ApiError("The user list from the server was not valid.")
  }

  return parsed.data
}

export async function fetchUser(id: number): Promise<User> {
  const response = await request(`${usersEndpoint}/${id}`)

  if (response.status === 404) {
    throw new ApiError("This user could not be found.")
  }

  if (!response.ok) {
    throw new ApiError("Could not load this user. Try again.")
  }

  const payload: unknown = await response.json()
  const parsed = userSchema.safeParse(payload)

  if (!parsed.success) {
    throw new ApiError("This user could not be found.")
  }

  return parsed.data
}

export async function createUserRequest(input: CreateUserInput): Promise<void> {
  const response = await request(usersEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: input.name,
      email: input.email,
      company: { name: input.companyName },
    }),
  })

  if (!response.ok) {
    throw new ApiError("Could not add the user. Try again.")
  }
}

export async function deleteUserRequest(id: number): Promise<void> {
  const response = await request(`${usersEndpoint}/${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new ApiError("Could not delete the user. Try again.")
  }
}
