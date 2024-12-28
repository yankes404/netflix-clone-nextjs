import { sql } from "drizzle-orm";
import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

import { verificationTokenValidityLength } from "@/config";
import { getAllCategoriesIds } from "@/features/categories/utils";
import { ProfileImage } from "@/features/profiles/types";
import { SubscriptionType } from "@/features/subscriptions/types";
import { TrackType } from "@/features/tracks/types";

const allCategoriesIds = getAllCategoriesIds() as string[];
export const trackCategories = pgEnum("track_category", allCategoriesIds as [string, ...string[]]);

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  password: text("password"),
  image: text("image"),
  currentPlan: text("currentPlan", { enum: [
    SubscriptionType.BASIC,
    SubscriptionType.FAMILY,
  ] }),
  customerId: text("customerId").unique()
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const verificationTokens = pgTable("verification_token", {
  token: text("token")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  expiresAt: timestamp("expiresAt")
    .$defaultFn(() => new Date(new Date().getTime() + verificationTokenValidityLength))
    .notNull(),
  userEmail: text("userEmail")
    .notNull()
    .references(() => users.email, { onDelete: "cascade" })
    .unique(),
  expectedEmail: text("expectedEmail").notNull()
});

export const profiles = pgTable(
  "profile",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    createdAt: timestamp("createdAt").defaultNow(),
    image: text("image", { enum: [
      ProfileImage.RED,
      ProfileImage.BLUE,
      ProfileImage.YELLOW,
      ProfileImage.GREEN,
      ProfileImage.GRAY,
    ] }).notNull()
  }
);

export const tracks = pgTable(
  "track",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    type: text("type", { enum: [
      TrackType.MOVIE,
      TrackType.SERIE,
    ] }).notNull(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    year: integer("year")
      .$defaultFn(() => new Date().getFullYear())
      .notNull(),
    ageLimit: text("ageLimit", { enum: ["7+", "12+", "16+", "18+"] }),

    // Serie Data
    seasons: integer("seasons"),

    // Movie Data
    path: text("path"),

    logo: text("logo").notNull(),
    poster: text("poster").notNull(),

    categories: trackCategories("categories").array().default(sql`'{}'`).notNull()
  }
)

export const episodes = pgTable(
  "episode",
  {
    id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
    trackId: text("trackId")
      .notNull()
      .references(() => tracks.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description").notNull(),
    path: text("path"),
    season: integer("season").notNull()
  }
)

export const watchTimes = pgTable(
  "watch_time",
  {
    id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
    profileId: text("profileId")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" })
      .notNull(),
    trackId: text("trackId")
      .notNull()
      .references(() => tracks.id, { onDelete: "cascade" })
      .notNull(),
    episodeId: text("episodeId")
      .references(() => episodes.id, { onDelete: "cascade" }),
    time: integer("time")
      .default(0)
      .notNull(),
    updatedAt: timestamp("updatedAt").defaultNow()
  }
)

export const profileLists = pgTable(
  "profile_list",
  {
    id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
    profileId: text("profileId")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" })
      .notNull(),
    trackId: text("trackId")
      .notNull()
      .references(() => tracks.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("createdAt").defaultNow()
  }
)