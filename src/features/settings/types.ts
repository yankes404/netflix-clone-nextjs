import { z } from "zod";

import { editUserEmailSchema, editUserNameSchema, editUserPasswordSchema } from "./schemas";

export type EditUserNameType = z.infer<typeof editUserNameSchema>;
export type EditUserEmailType = z.infer<typeof editUserEmailSchema>;
export type EditUserPasswordType = z.infer<typeof editUserPasswordSchema>;

export enum SettingPageEnum {
    GENERAL = "general",
    PROFILES = "profiles",
    SECURITY = "security",
    SUBSCRIPTIONS = "subscriptions",
}