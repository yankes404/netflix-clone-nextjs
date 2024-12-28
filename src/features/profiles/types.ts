import { InferSelectModel } from "drizzle-orm";

import { profiles } from "@/db/schemas";

export enum ProfileImage {
    RED = "red",
    BLUE = "blue",
    YELLOW = "yellow",
    GREEN = "green",
    GRAY = "gray"
}

export type Profile = InferSelectModel<typeof profiles>;
export type MiniProfile = Omit<Profile, "userId" | "createdAt">;