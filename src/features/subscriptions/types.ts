export enum SubscriptionType {
    BASIC = "basic",
    FAMILY = "family"
}

export type SubscriptionLimits = {
    maxProfiles: number;
}

export type SubscriptionData = Record<SubscriptionType, {
    name: string;
    price: number;
    priceId: string;
    features: string[];
    limits: SubscriptionLimits;
}>;

export type StripePaymentStatus = "complete" | "expired" | "open";