// src/types/user.ts
export type User = {
  id: number | string
  name: string
  email: string
  phone?: string
  bio?: string
  avatar?: string
  createdAt?: string
  updatedAt?: string
}