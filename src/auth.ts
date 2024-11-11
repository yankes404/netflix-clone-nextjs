import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/db/utils";
import { users } from "@/db/schemas";
import { eq } from "drizzle-orm";

import "next-auth";
import { loginSchema } from "./features/auth/schemas"
import bcrypt from "bcryptjs";
import { cookies } from "next/headers"
import { SubscriptionType } from "./features/subscriptions/types"

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      emailVerified?: Date | null;
      image: string;
      isSubscribed: boolean;
      currentPlan: SubscriptionType | null;
      profileId?: string | null;
    };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub,
    Google,
    Credentials({
      authorize: async (credentials) => {
        const validatedFields = loginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const existingUsers = await db.select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1)

          const user = existingUsers[0];

          if (user && user.password) {
            const isPasswordsMatch = await bcrypt.compare(
              password,
              user.password
            );

            if (isPasswordsMatch) {
              return user;
            }
          }
        }

        return null;
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/sign-in"
  },
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
    async session({ session, token }) {
      if (token && token.sub) {
        session.user.id = token.sub;        
        const profileCookie = cookies().get("ync-profile-id");

        const fetchedUsers = await db
          .select()
          .from(users)
          .where(eq(users.id, session.user.id))

        const user = fetchedUsers[0];

        session.user.isSubscribed = !!user.currentPlan;
        session.user.currentPlan = user.currentPlan;
        session.user.profileId = profileCookie?.value;

        session.user.emailVerified = user.emailVerified;

        if (user) {
          if (user.name) {
            session.user.name = user.name;
          }

          if (user.email) {
            session.user.email = user.email;
          }

          if (user.emailVerified) {
            session.user.emailVerified = user.emailVerified;
          }

          if (user.image) {
            session.user.image = user.image;
          }
        }
      }
      return session;
    },
  },
})