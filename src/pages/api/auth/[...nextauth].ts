import prisma from "@/libs/prisma";
import { isPasswordValid } from "@/utils/hash";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login", // Trang đăng nhập
  },
  secret: process.env.NEXTAUTH_SECRET, // Bảo mật
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("Credentials received:", credentials);
        const { email, password } = credentials as { email: string; password: string };

        // Tìm người dùng trong database
        const user = await prisma.user.findFirst({
          where: { email: email },
        });

        if (!user) {
          console.error("User not found");
          return null;
        }

        // Kiểm tra mật khẩu
        const isPasswordMatch = await isPasswordValid(password, user.password);
        if (!isPasswordMatch) {
          console.error("Invalid password");
          return null;
        }

        // Trả về thông tin người dùng
        return {
          id: user.id.toString(),
          email: user.email,
          name: user.username,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Thêm thông tin người dùng vào token
      if (user) {
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      // Thêm thông tin từ token vào session
      if (token) {
        session.user = {
          ...session.user,
          email: token.email as string,
        };
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);