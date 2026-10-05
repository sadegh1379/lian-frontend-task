import { z } from "zod"

const geoSchema = z.object({
  lat: z.string(),
  lng: z.string(),
})

const addressSchema = z.object({
  street: z.string(),
  suite: z.string(),
  city: z.string(),
  zipcode: z.string(),
  geo: geoSchema,
})

const companySchema = z.object({
  name: z.string(),
  catchPhrase: z.string(),
  bs: z.string(),
})

export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  username: z.string(),
  email: z.string(),
  phone: z.string(),
  website: z.string(),
  address: addressSchema,
  company: companySchema,
})

export const userListSchema = z.array(userSchema)

export const createUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters."),
  email: z.email("Enter a valid email address."),
  companyName: z
    .string()
    .trim()
    .min(2, "Company name must be at least 2 characters."),
})

export const userMutationsSchema = z.object({
  created: z.array(userSchema),
  deletedIds: z.array(z.number()),
})

export type User = z.infer<typeof userSchema>
export type CreateUserInput = z.infer<typeof createUserSchema>
export type UserMutations = z.infer<typeof userMutationsSchema>
