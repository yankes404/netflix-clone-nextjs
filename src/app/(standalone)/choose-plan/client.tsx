"use client";

import { useCreateCheckoutSession } from "@/features/subscriptions/api/use-create-checkout-session";
import { PlanCard } from "@/features/subscriptions/components/plan-card";
import { plans } from "@/features/subscriptions/constants";
import { SubscriptionType } from "@/features/subscriptions/types";

export const ChoosePlanClient = () => {
    const { mutate, isPending } = useCreateCheckoutSession();

    const subscribe = (plan: SubscriptionType) => {
        mutate(plan);
    }

    return (
        <div className="w-full flex flex-col items-center justify-center mt-8">
            <h1 className="text-center font-semibold text-2xl">Choose your plan</h1>
            <p className="text-center text-sm text-muted-foreground mt-2">If you want to use Netflix, you have to select your plan</p>
            <p className="text-neutral-400 text-xs font-medium mt-1 text-center">This application is only clone, so payments are in test mode. Don&apos;t worry, you won&apos;t be charged</p>
            <div className="flex gap-4 mt-8 flex-col lg:flex-row w-full justify-center">
                <PlanCard
                    name={plans[SubscriptionType.BASIC].name}
                    price={plans[SubscriptionType.BASIC].price}
                    features={plans[SubscriptionType.BASIC].features}
                    onSubscribe={() => subscribe(SubscriptionType.BASIC)}
                    disabled={isPending}
                />
                <PlanCard
                    name={plans[SubscriptionType.FAMILY].name}
                    price={plans[SubscriptionType.FAMILY].price}
                    features={plans[SubscriptionType.FAMILY].features}
                    onSubscribe={() => subscribe(SubscriptionType.FAMILY)}
                    disabled={isPending}
                />
            </div>
        </div>
    )
}