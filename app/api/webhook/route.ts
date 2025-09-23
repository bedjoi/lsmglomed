import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

export async function POST(req: Request) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("Stripe-Signature") as string;
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
        console.log(`❌ Error message: ${err}`);
        return new NextResponse(`Webhook Error: ${err}`, { status: 400 });
    }
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const courseId = session.metadata?.courseId;

    if (event.type === "checkout.session.completed") {
        if (!userId || !courseId) {
            return new NextResponse("Missing metadata", { status: 400 });
        }
        await db.purchase.create({
            data: {
                userId: userId,
                courseId: courseId,
            },
        });
    } else {
        return new NextResponse(
            `webhook Error : unhandled event type ${event.type} `,
            { status: 200 }
        );
    }

    return new NextResponse(null, { status: 200 });
}
