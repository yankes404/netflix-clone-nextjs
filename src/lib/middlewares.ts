"use server";

import { auth } from "@/auth";
import { Session } from "@auth/core/types";

export const sessionMiddleware = async <T>(callbackFn: (session: Session) => T | Promise<T>, defaultValue?: T) => {
    const session = await auth();

    if (!session || !session.user) {
        if (defaultValue === undefined) {
            return { error: "Not logged in" };    
        } else {
            return defaultValue;
        }
    }

    return callbackFn(session);
}

export const subscribedOnlyMiddleware = async <T>(callbackFn: (session: Session) => T) => sessionMiddleware((session) => {
    if (!session.user.isSubscribed) {
        return { error: "You don't have any active plan now" };
    }

    return callbackFn(session);
});