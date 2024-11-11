import { plans } from "./constants";
import { SubscriptionData, SubscriptionType } from "./types";

export const convertPlansToArray = (plans: SubscriptionData) => Object.entries(plans).map(([type, details]) => ({
    type: type as SubscriptionType,
    ...details
}));

export const findPlanByPriceId = (priceId: string) => convertPlansToArray(plans).find((plan) => plan.priceId === priceId) ?? null;