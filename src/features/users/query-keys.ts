export const userKeys = {
  all: ["users"] as const,
  remote: ["users", "remote"] as const,
  mutations: ["users", "mutations"] as const,
  detail: (id: number) => ["users", "detail", id] as const,
}
