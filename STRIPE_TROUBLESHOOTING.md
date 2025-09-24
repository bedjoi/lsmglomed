# Guide de Dépannage Stripe - LMS Glomed

## 🚨 Problèmes Résolus

### 1. Erreur de Télémétrie Clerk

**Problème :** `Failed to create telemetry flag file: [TypeError: mkdir is not a function]`

**Solution :** Ajout de `CLERK_TELEMETRY_DISABLED=1` dans le fichier `.env`

### 2. Erreur 404 sur Webhook

**Problème :** `POST /webhook 404`

**Cause :** Stripe CLI configuré pour `/webhook` au lieu de `/api/webhook`

**Solution :** Utiliser la commande correcte :

```bash
stripe listen --forward-to localhost:3000/api/webhook
```

### 3. Configuration .env Corrompue

**Problèmes trouvés :**

- Ligne `[object Promise]` invalide
- Guillemets incorrects dans `DATABASE_URL`
- Espace en fin de ligne dans `STRIPE_WEBHOOK_SECRET`

**Solution :** Nettoyage du fichier `.env`

## 🛠️ Scripts de Développement

### Démarrage Complet

```bash
./start-dev.sh
```

Démarre Next.js et le webhook Stripe automatiquement.

### Webhook Stripe Uniquement

```bash
./start-stripe-webhook.sh
```

Démarre uniquement le webhook Stripe (Next.js doit être déjà en cours d'exécution).

### Démarrage Manuel

```bash
# Terminal 1 - Next.js
PORT=3000 npm run dev

# Terminal 2 - Webhook Stripe
stripe listen --forward-to localhost:3000/api/webhook
```

## 🔍 Tests de Paiement

### Cartes de Test Stripe

```
Succès : 4242424242424242
Échec : 4000000000000002
3D Secure : 4000000000003220
```

### URLs de Test

- Application : http://localhost:3000
- Webhook : http://localhost:3000/api/webhook
- Test checkout : http://localhost:3000/courses/[courseId]

## 📋 Checklist de Dépannage

### Avant de Commencer

- [ ] Stripe CLI installé et connecté
- [ ] Variables d'environnement configurées
- [ ] Base de données accessible
- [ ] Port 3000 libre

### En Cas de Problème

1. **Vérifier les logs :**
    - Console Next.js
    - Console Stripe CLI
    - Onglet Réseau du navigateur

2. **Nettoyer l'environnement :**

    ```bash
    pkill -f "next"
    pkill -f "stripe"
    rm -rf .next
    ```

3. **Vérifier la configuration :**
    - Fichier `.env` sans erreurs
    - URLs webhook correctes
    - Clés Stripe valides

### Variables d'Environnement Requises

```env
# Clerk
CLERK_TELEMETRY_DISABLED=1
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Stripe
STRIPE_API_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Base de données
DATABASE_URL=mysql://user:password@localhost:3306/database
```

## 🐛 Erreurs Communes

### "mkdir is not a function"

- **Cause :** Télémétrie Clerk activée
- **Solution :** `CLERK_TELEMETRY_DISABLED=1`

### "POST /webhook 404"

- **Cause :** URL webhook incorrecte
- **Solution :** Utiliser `/api/webhook`

### "Webhook signature verification failed"

- **Cause :** `STRIPE_WEBHOOK_SECRET` incorrect
- **Solution :** Copier la clé depuis Stripe CLI

### "Database connection failed"

- **Cause :** MySQL non démarré ou URL incorrecte
- **Solution :** Vérifier MySQL et `DATABASE_URL`

## 📞 Support

En cas de problème persistant :

1. Vérifier les logs détaillés dans la console
2. Tester avec les cartes de test Stripe
3. Vérifier la configuration webhook dans Stripe Dashboard
4. Consulter la documentation Stripe et Next.js

## 🔄 Processus de Paiement

1. **Utilisateur clique sur "Acheter"**
2. **Route `/api/courses/[courseId]/checkout`** crée une session Stripe
3. **Redirection vers Stripe Checkout**
4. **Paiement effectué**
5. **Webhook `/api/webhook`** reçoit l'événement
6. **Création de l'achat en base de données**
7. **Redirection vers le cours**

Chaque étape est loggée avec des emojis pour faciliter le débogage ! 🎉
