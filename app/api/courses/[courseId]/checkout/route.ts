import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const user = await currentUser();
        const { courseId } = await params;
        if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const course = await db.course.findUnique({
            where: { id: courseId, isPublished: true },
        });
        const purchase = await db.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId: user.id,
                    courseId: courseId,
                },
            },
        });
        if (purchase) {
            return new NextResponse("You already own this course", {
                status: 400,
            });
        }
        if (!course) {
            return new NextResponse("Course not found", { status: 404 });
        }
        if (course.price === 0) {
            return new NextResponse("Course is free", { status: 400 });
        }
        const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
            {
                quantity: 1,
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: course.title,
                        description: course.description || undefined,
                    },
                    unit_amount: Math.round(course.price * 100), // in cents
                },
            },
        ];

        let stripeCustomer = await db.stripeCustomer.findUnique({
            where: { userId: user.id },
            select: {
                stripeCustomerId: true,
            },
        });
        if (!stripeCustomer) {
            // Create a new Stripe customer
            const customer = await stripe.customers.create({
                email: user.emailAddresses[0].emailAddress,
            });
            // Save the Stripe customer ID in the database
            stripeCustomer = await db.stripeCustomer.create({
                data: {
                    userId: user.id,
                    stripeCustomerId: customer.id,
                },
            });
        }

        // Create a checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            customer_email: user.emailAddresses[0].emailAddress,
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: course.title,
                            description: course.description || undefined,
                        },
                        unit_amount: course.price * 100, // in cents
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseId}?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseId}?canceled=true`,
            metadata: {
                userId: user.id,
                courseId: course.id,
            },
        });
        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.log("[COURSE_ID_CHECKOUT_POST]", error);
        return new NextResponse("Internal error", { status: 500 });
    }

    // Validate request and create a checkout session
}
