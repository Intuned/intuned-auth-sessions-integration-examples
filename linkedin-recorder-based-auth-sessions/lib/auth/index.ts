import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "../db";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import config from "./configs";
import { compare } from "bcrypt-ts";
import { getUser } from "../services/user";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...config,
  trustHost: true,
  adapter: DrizzleAdapter(db),
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.uid as string;
      }
      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
  },
  providers: [
    Credentials({
      async authorize({ email, password }: any) {
        let user = await getUser(email);
        if (user.length === 0) return null;
        let passwordsMatch = await compare(password, user[0].password!);
        if (passwordsMatch) return user[0] as any;
      },
    }),
  ],
});

export async function getLoggedInUserId() {
  const session = await auth();

  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("User not authenticated");
  }

  return userId;
}
