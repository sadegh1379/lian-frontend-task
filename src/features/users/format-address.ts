import type { User } from "@/features/users/schema"

export function formatAddress(address: User["address"]): string {
  const streetLine = [address.street, address.suite].filter(Boolean).join(", ")
  const cityLine = [address.city, address.zipcode].filter(Boolean).join(" ")

  return [streetLine, cityLine].filter(Boolean).join(", ")
}
