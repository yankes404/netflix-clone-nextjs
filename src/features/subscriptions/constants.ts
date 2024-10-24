import { SubscriptionData, SubscriptionType } from "./types";

export const plans: SubscriptionData = {
    [SubscriptionType.BASIC]: {
        name: "Netflix Basic",
        price: 9.99 * 100,
        priceId: "price_1QD8mTANnWVxbPxJtOKanatJ",
        features: [
            "Only 1 profile",
            "Full HD and 4K videos"
        ]
    },
    [SubscriptionType.FAMILY]: {
        name: "Netflix Family",
        price: 19.99 * 100,
        priceId: "price_1QD8mzANnWVxbPxJwBqCXc5i",
        features: [
            "Up to 5 profiles",
            "Full HD and 4K videos"
        ]
    },
}