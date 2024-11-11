"use server";

import { getStripe } from "./utils";
import { plans } from "./constants";
import { sessionMiddleware } from "../../lib/middlewares";
import { StripePaymentStatus, SubscriptionType } from "./types";

const stripe = getStripe();

export const createCheckout = async (plan: SubscriptionType) => sessionMiddleware(async ({ user }) => {
    if (user.isSubscribed) {
        return { error: "Already have a subscription" }
    }

    const priceId = plans[plan].priceId;

    const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [
            {
                price: priceId,
                quantity: 1
            }
        ],
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscriptions/status?id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscriptions/error=true`,
        customer_email: user.email,
        locale: "en",
        metadata: {
            userId: user.id
        }
    });

    return {
        url: session.url
    }
});

export const retrieveSessionStatus = async (id: string): Promise<{ status: StripePaymentStatus | null }> => {
    if (!id) return { status: null }

    const session = await stripe.checkout.sessions.retrieve(id);

    if (!session) return { status: null }

    return { status: session.status }
}