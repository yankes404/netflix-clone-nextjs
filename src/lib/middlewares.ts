"use server";

import { auth } from "@/auth";
import { Session } from "@auth/core/types";

export const sessionMiddleware = async <T>(callbackFn: (session: Session) => T) => {
    const session = await auth();

    if (!session || !session.user) return { error: "Not logged in" };
    return callbackFn(session);
}