"use client";

import { PaymentStatusCard } from "@/features/subscriptions/components/payment-status-card";

export const SubscriptionStatusClient = () => {
    return (
        <div className="flex justify-center mt-8">
            <PaymentStatusCard />
        </div>
    )
}