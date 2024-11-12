import { users } from "@/db/schemas";
import { db } from "@/db/utils";
import { getStripe } from "@/features/subscriptions/utils";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { findPlanByPriceId } from "@/features/subscriptions/helpers";

const stripe = getStripe();

export const POST = async (
    req: NextRequest
) => {
    const body = await req.text();
    const signature = headers().get("Stripe-Signature") as string;

    try {
        const event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );

        const data = event.data;
        const eventType = event.type;

        switch(eventType) {
            case "checkout.session.completed": {
                const session = await stripe.checkout.sessions.retrieve(
                    // @ts-expect-error data.object.id as a type is not a string, so this is the only way to pass this as an argument to this function
                    data.object.id as string,
                    {
                        expand: ["line_items"]
                    }
                );
                
                const priceId = session.line_items?.data[0]?.price?.id;
                const userId = session.metadata?.userId;

                if (!priceId || !userId) {
                    throw new Error("No priceId or userId")
                }

                const customerId = session.customer;
                const customerEmail = session.customer_email;

                if (!customerId || !customerEmail || typeof customerId !== "string") {
                    throw new Error("No customer or customer_email");
                }

                const plan = findPlanByPriceId(priceId);

                if (!plan) {
                    throw new Error("Plan not found")
                }

                const fetchedUsers = await db
                    .select()
                    .from(users)
                    .where(and(
                        eq(users.id, userId),
                        eq(users.email, customerEmail),
                    ));

                const user = fetchedUsers[0];

                if (!user) {
                    throw new Error("User not found");
                }

                await db
                    .update(users)
                    .set({ currentPlan: plan.type, customerId })
                    .where(eq(users.id, user.id))

                return NextResponse.json({ success: true });
            }
            case "customer.subscription.updated": {
                const subscription = await stripe.subscriptions.retrieve(
                    // @ts-expect-error data.object.id as a type is not a string, so this is the only way to pass this as an argument to this function
                    data.object.id as string
                );
            
                const customerId = subscription.customer;

                if (!customerId || typeof customerId !== "string") {
                    return NextResponse.json({ error: "No customer" }, { status: 400 });
                }

                const priceId = subscription.items?.data[0]?.price?.id;

                if (!priceId) {
                    throw new Error("No priceId");
                }

                const plan = findPlanByPriceId(priceId);

                if (!plan) {
                    throw new Error("Plan not found");
                }

                const isCanceled = !!subscription.cancel_at;       
                
                const fetchedUsers = await db
                    .select()
                    .from(users)
                    .where(and(
                        eq(users.customerId, customerId),
                    ));

                const user = fetchedUsers[0];

                if (!user) {
                    throw new Error("User not found");
                }
                
                await db
                    .update(users)
                    .set({ currentPlan: isCanceled ? null : plan.type })
                    .where(eq(users.id, user.id))

                return NextResponse.json({ success: true });
            }
            case "customer.subscription.deleted": {
                const subscription = await stripe.subscriptions.retrieve(
                    // @ts-expect-error data.object.id as a type is not a string, so this is the only way to pass this as an argument to this function
                    data.object.id as string
                );

                const customerId = subscription.customer;

                if (!customerId || typeof customerId !== "string") {
                    throw new Error("No customer")
                }

                const fetchedUsers = await db
                    .select()
                    .from(users)
                    .where(eq(users.customerId, customerId));

                const user = fetchedUsers[0];

                if (!user) {
                    throw new Error("No user");
                }

                await db
                    .update(users)
                    .set({ currentPlan: null })
                    .where(eq(users.id, user.id))

                return NextResponse.json({ success: true });
            }
            default:
                return NextResponse.json({ error: "Unhandled event type" }, { status: 400  })
        }
    } catch (error) {
        if (process.env.NODE_ENV !== "production") {
            console.error(error);
        }

        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }

}