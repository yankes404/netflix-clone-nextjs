import { SubscriptionType } from "../subscriptions/types";

export type UserType = {
    id: string;
    name: string;
    email: string;
    emailVerified?: Date | null;
    image: string;
    isSubscribed: boolean;
    currentPlan: SubscriptionType | null;
    profileId?: string | null;
}