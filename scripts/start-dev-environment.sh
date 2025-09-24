#!/bin/bash

# Script pour démarrer l'environnement de développement complet
# Ce script lance l'application Next.js et donne les instructions pour le webhook Stripe

echo "🚀 Démarrage de l'environnement de développement Glomed Academia"
echo "================================================================"
echo ""

# Vérifier si les variables d'environnement importantes sont présentes
if [ ! -f ".env" ]; then
    echo "❌ Fichier .env manquant !"
    echo "   Créez un fichier .env avec les variables nécessaires"
    exit 1
fi

# Vérifier si Stripe CLI est installé
if ! command -v stripe &> /dev/null; then
    echo "⚠️  CLI Stripe non trouvée"
    echo "   Installez la CLI Stripe : https://stripe.com/docs/stripe-cli"
    echo "   Ou continuez sans webhook (les paiements ne seront pas traités)"
    echo ""
fi

echo "📋 Instructions de démarrage :"
echo ""
echo "1. 🖥️  L'application Next.js va démarrer sur http://localhost:3000"
echo "2. 🔗 Dans un NOUVEAU terminal, lancez le webhook Stripe :"
echo "   cd $(pwd)"
echo "   ./scripts/start-stripe-webhook.sh"
echo "   OU"
echo "   stripe listen --forward-to localhost:3000/api/webhook"
echo ""
echo "3. 🧪 Testez avec les cartes de test Stripe :"
echo "   - Succès : 4242424242424242"
echo "   - Échec : 4000000000000002"
echo ""
echo "🔄 Démarrage de l'application..."
echo ""

# Démarrer l'application Next.js
npm run dev