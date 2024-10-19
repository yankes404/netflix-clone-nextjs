import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
// import Credentials from "next-auth/providers/credentials"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/db/utils";
import { users } from "@/db/schemas";
import { eq } from "drizzle-orm";

import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image: string;
    };
    premium: boolean;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  events: {
    linkAccount: async ({ user }) => {
      if (user.id) {
        await db.update(users)
          .set({ emailVerified: new Date() })
          .where(eq(users.id, user.id))
      }
    }
  },
  callbacks: {
    async session({ session }) {
      session.premium = false;  

      return session;
    },
  },
  providers: [
    GitHub,
    Google,
  ],
})