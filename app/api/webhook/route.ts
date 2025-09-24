import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

export async function POST(req: Request) {
    // Vérifier que la clé secrète du webhook est configurée
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
        console.log("❌ STRIPE_WEBHOOK_SECRET n'est pas configuré");
        return new NextResponse("Configuration du webhook manquante", {
            status: 500,
        });
    }

    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("Stripe-Signature") as string;

    // Vérifier que la signature est présente
    if (!signature) {
        console.log("❌ Signature Stripe manquante");
        return new NextResponse("Signature manquante", { status: 400 });
    }

    let event: Stripe.Event;

    try {
        // Construire l'événement Stripe avec vérification de signature
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        console.log("✅ Événement Stripe vérifié:", event.type);
    } catch (err) {
        console.log(`❌ Erreur de vérification du webhook: ${err}`);
        return new NextResponse(`Erreur de webhook: ${err}`, { status: 400 });
    }
    // Traiter uniquement les événements de session de checkout
    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const courseId = session.metadata?.courseId;

        console.log("🔄 Traitement de checkout.session.completed");
        console.log("📋 Métadonnées:", { userId, courseId });

        if (!userId || !courseId) {
            console.log("❌ Métadonnées manquantes dans la session");
            return new NextResponse("Métadonnées manquantes", { status: 400 });
        }

        try {
            // Vérifier si l'achat existe déjà pour éviter les doublons
            const existingPurchase = await db.purchase.findUnique({
                where: {
                    userId_courseId: {
                        userId: userId,
                        courseId: courseId,
                    },
                },
            });

            if (existingPurchase) {
                console.log("⚠️ Achat déjà existant, ignoré");
                return new NextResponse("Achat déjà traité", { status: 200 });
            }

            // Créer l'achat dans la base de données
            await db.purchase.create({
                data: {
                    userId: userId,
                    courseId: courseId,
                },
            });

            console.log("✅ Achat créé avec succès");
        } catch (error) {
            console.log("❌ Erreur lors de la création de l'achat:", error);
            return new NextResponse("Erreur de base de données", {
                status: 500,
            });
        }
    } else {
        console.log(`ℹ️ Type d'événement non traité: ${event.type}`);
        return new NextResponse(`Type d'événement non traité: ${event.type}`, {
            status: 200,
        });
    }

    return new NextResponse("Webhook traité avec succès", { status: 200 });
}
