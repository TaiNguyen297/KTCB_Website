import prisma from "@/libs/prisma";
import { isPasswordValid } from "@/utils/hash";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      //@ts-ignore
      async authorize(credentials) {
        const { email, password } = credentials as any;
        const user = await prisma.user.findFirst({
          where: { email: email },
        });

        if (!user) {
          return null;
        }

        const isPasswordMatch = await isPasswordValid(password, user.password);

        if (!isPasswordMatch) {
          return null;
        }

        return user;
      },
    }),
  ],
};

export default NextAuth({
  callbacks: {
    async session({ session, token, user }) {
      return session; // The return type will match the one returned in `useSession()`
    },
  },
  ...authOptions,
});
