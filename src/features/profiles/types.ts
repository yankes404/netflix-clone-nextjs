import { profiles } from "@/db/schemas";
import { InferSelectModel } from "drizzle-orm";

export enum ProfileImage {
    RED = "red",
    BLUE = "blue",
    YELLOW = "yellow",
    GREEN = "green",
    GRAY = "gray"
}

export type Profile = InferSelectModel<typeof profiles>