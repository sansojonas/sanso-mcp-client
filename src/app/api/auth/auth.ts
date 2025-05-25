import { compare } from "bcrypt-ts";
import { userRepository } from "lib/db/repository";
import NextAuth, { type DefaultSession } from "next-auth";
import type { DefaultJWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import { rememberUserAction } from "./actions";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
  interface User {
    id?: string;
    email?: string | null;
    image?: string | null;
  }
}
declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
  }
}

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  pages: {
    signIn: "/login",
    newUser: "/",
  },
  providers: [
    Credentials({
      credentials: {},
      async authorize({ email, password }: any) {
        const user = await userRepository.selectByEmail(email);
        if (!user) {
          throw new Error("User not found");
        }
        const passwordsMatch = await compare(password, user.password);
        if (!passwordsMatch) {
          throw new Error("Invalid credentials");
        }
        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const user = await rememberUserAction(token.id);
        if (!user) throw new Error("User not found");
        session.user.id = token.id;
      }
      return session;
    },
  },
});
