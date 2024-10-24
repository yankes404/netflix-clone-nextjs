export enum SubscriptionType {
    BASIC = "basic",
    FAMILY = "family"
}

export type SubscriptionData = Record<SubscriptionType, {
    name: string;
    price: number;
    priceId: string;
    features: string[];
}>;

export type StripePaymentStatus = "complete" | "expired" | "open";