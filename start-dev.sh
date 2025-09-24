#!/bin/bash

# Script pour démarrer l'environnement de développement
echo "🚀 Démarrage de l'environnement de développement..."

# Nettoyer les processus existants
echo "🧹 Nettoyage des processus existants..."
pkill -f "next" 2>/dev/null || true
pkill -f "stripe" 2>/dev/null || true

# Nettoyer le cache Next.js
echo "🗑️ Nettoyage du cache Next.js..."
rm -rf .next

# Démarrer le serveur Next.js
echo "▶️ Démarrage du serveur Next.js sur le port 3000..."
PORT=3000 npm run dev &
NEXTJS_PID=$!

# Attendre que Next.js soit prêt
echo "⏳ Attente du démarrage de Next.js..."
sleep 10

# Démarrer le webhook Stripe
echo "🔗 Démarrage du webhook Stripe..."
stripe listen --forward-to localhost:3000/api/webhook &
STRIPE_PID=$!

echo "✅ Environnement de développement démarré!"
echo "📝 Next.js PID: $NEXTJS_PID"
echo "📝 Stripe PID: $STRIPE_PID"
echo ""
echo "🌐 Application: http://localhost:3000"
echo "🔗 Webhook: localhost:3000/api/webhook"
echo ""
echo "Pour arrêter les services:"
echo "kill $NEXTJS_PID $STRIPE_PID"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter tous les services..."

# Fonction pour nettoyer à la sortie
cleanup() {
    echo ""
    echo "🛑 Arrêt des services..."
    kill $NEXTJS_PID 2>/dev/null || true
    kill $STRIPE_PID 2>/dev/null || true
    echo "✅ Services arrêtés"
    exit 0
}

# Capturer Ctrl+C
trap cleanup SIGINT

# Attendre indéfiniment
wait