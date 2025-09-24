#!/bin/bash

echo "🔗 Démarrage du webhook Stripe..."
echo "📍 Redirection vers: localhost:3000/api/webhook"
echo ""

# Vérifier si Stripe CLI est installé
if ! command -v stripe &> /dev/null; then
    echo "❌ Stripe CLI n'est pas installé"
    echo "📥 Installez-le avec: https://stripe.com/docs/stripe-cli"
    exit 1
fi

# Démarrer le webhook
stripe listen --forward-to localhost:3000/api/webhook