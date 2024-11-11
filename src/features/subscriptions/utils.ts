import "server-only"

import { Stripe } from "stripe";

export const getStripe = () => {
    const stripe = new Stripe(process.env.STRIPE_SECRET!);
    return stripe;
}