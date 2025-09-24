#!/bin/bash

# Script pour démarrer le webhook Stripe en mode développement
# Ce script lance la CLI Stripe pour écouter les événements et les transférer vers l'application locale

echo "🚀 Démarrage du webhook Stripe..."
echo "📡 Écoute des événements Stripe et transfert vers http://localhost:3000/api/webhook"
echo ""
echo "⚠️  Assurez-vous que :"
echo "   1. Votre application Next.js fonctionne sur le port 3000"
echo "   2. La CLI Stripe est installée (stripe CLI)"
echo "   3. Vous êtes connecté à votre compte Stripe (stripe login)"
echo ""
echo "🔄 Pour arrêter le webhook, appuyez sur Ctrl+C"
echo ""

# Lancer la CLI Stripe pour écouter les webhooks
stripe listen --forward-to localhost:3000/api/webhook