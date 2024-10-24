import { subscriptions } from "@/db/schemas";
import { db } from "@/db/utils";
import { and, eq, gt } from "drizzle-orm";
import "server-only"

import { Stripe } from "stripe";
import { SubscriptionType } from "./types";

export const getStripe = () => {
    const stripe = new Stripe(process.env.STRIPE_SECRET!);
    return stripe;
}

export const getUserSubscription = async (userId: string, active = true) => {
    // const where = active ? and(
    //     eq(subscriptions.userId, userId),
    //     gt(subscriptions.expiresAt, new Date())
    // ) : eq(subscriptions.userId, userId)

    // const activeSubscriptions = await db.select()
    //     .from(subscriptions)
    //     .where(where)

    // return activeSubscriptions[0];

    // TODO

    return {
        id: "test",
        userId: "test",
        type: SubscriptionType.BASIC,
        createdAt: new Date(),
        expiresAt: new Date(2025, 0, 31)
    }
}