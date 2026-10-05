import { userListSchema, type CreateUserInput, type User } from "@/features/users/schema"

const usersEndpoint = "https://jsonplaceholder.typicode.com/users"

export class ApiError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ApiError"
  }
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError"
}

async function request(url: string, init?: RequestInit): Promise<Response> {
  try {
    return await fetch(url, init)
  } catch (error) {
    if (isAbortError(error)) {
      throw error
    }

    throw new ApiError("Network error. Check your connection and try again.")
  }
}

export async function fetchUsers(signal?: AbortSignal): Promise<User[]> {
  const response = await request(usersEndpoint, { signal })

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

export async function createUserRequest(input: CreateUserInput): Promise<void> {
  const response = await request(usersEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
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
