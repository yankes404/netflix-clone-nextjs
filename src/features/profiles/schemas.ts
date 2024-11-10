import { z } from "zod";
import { ProfileImage } from "./types";

export const createProfileSchema = z.object({
    name: z.string().trim().min(1, "Required"),
    image: z.nativeEnum(ProfileImage, { required_error: "Required" })
});