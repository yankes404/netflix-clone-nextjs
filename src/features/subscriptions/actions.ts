"use server";

import { sessionMiddleware } from "../../lib/middlewares";
import { getStripe } from "./utils";
import { plans } from "./constants";
import { StripePaymentStatus, SubscriptionType } from "./types";
import { createVerificationToken } from "../auth/actions";

const stripe = getStripe();

export const createCheckout = async (plan: SubscriptionType, cancelUrl: string = process.env.NEXT_PUBLIC_APP_URL!) => sessionMiddleware(async ({ user }) => {
    if (!user.emailVerified) {
        await createVerificationToken(
            user.email,
            user.name
        );
        
        return { error: `You have to verify email address to subscribe.` }
    }

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
        cancel_url: cancelUrl,
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