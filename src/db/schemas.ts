import { ProfileImage } from "@/features/profiles/types";
import { SubscriptionType } from "@/features/subscriptions/types";
import { TrackType } from "@/features/tracks/types";
import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  password: text("password"),
  image: text("image"),
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

export const subscriptions = pgTable(
  "subscription",
  {
    id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type", { enum: [
      SubscriptionType.BASIC,
      SubscriptionType.FAMILY,
    ] }),
    createdAt: timestamp("createdAt").defaultNow(),
    expiresAt: timestamp("expiresAt").notNull(),
  }
)

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
    path: text("path")
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