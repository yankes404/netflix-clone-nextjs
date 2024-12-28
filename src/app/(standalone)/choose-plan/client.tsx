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
        <div className="flex flex-col items-center justify-center w-full mt-8">
            <h1 className="text-2xl font-semibold text-center">Choose your plan</h1>
            <p className="mt-2 text-sm text-center text-muted-foreground">If you want to use Netflix, you have to select your plan</p>
            <p className="mt-1 text-xs font-medium text-center text-neutral-400">This application is only clone, so payments are in test mode. Don&apos;t worry, you won&apos;t be charged</p>
            <div className="flex flex-col justify-center w-full gap-4 mt-8 lg:flex-row">
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