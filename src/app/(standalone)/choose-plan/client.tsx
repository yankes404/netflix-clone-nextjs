"use client";

import { PlanCard } from "@/features/subscriptions/components/plan-card";
import { plans } from "@/features/subscriptions/constants";

export const ChoosePlanClient = () => {
    return (
        <div className="w-full flex flex-col items-center justify-center mt-8">
            <h1 className="text-center font-semibold text-2xl">Choose your plan</h1>
            <p className="text-center text-sm text-muted-foreground mt-2">If you want to use Netflix, you have to select your plan</p>
            <p className="text-neutral-400 text-xs font-medium mt-1 text-center">This application is only clone, so payments are in test mode. Don't worry, you won't be charged</p>
            <div className="flex gap-4 mt-8 flex-col lg:flex-row w-full justify-center">
                <PlanCard
                    name={plans["basic"].name}
                    price={plans["basic"].price}
                    features={plans["basic"].features}
                />
                <PlanCard
                    name={plans["family"].name}
                    price={plans["family"].price}
                    features={plans["family"].features}
                />
            </div>
        </div>
    )
}