import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      username: string
      email: string,
      roleId: string
    } & DefaultSession["user"]
  }
}
