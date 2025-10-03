# Instructions pour résoudre le problème de connexion Neon

## Problème identifié

Votre base de données Neon ne répond pas aux tentatives de connexion avec l'erreur `ECONNRESET`, ce qui indique qu'elle est probablement en veille ou qu'il y a un problème de configuration.

## Actions à effectuer immédiatement

### 1. Accédez à votre tableau de bord Neon

- Allez sur https://console.neon.tech
- Connectez-vous avec vos identifiants
- Sélectionnez votre projet "glomed"

### 2. Vérifiez l'état de votre base de données

- Regardez si votre base de données est marquée comme "Active", "Idle" ou "Suspended"
- Si elle est "Idle" ou "Suspended", cliquez dessus pour la réactiver
- Attendez quelques minutes que la réactivation soit complète

### 3. Vérifiez vos credentials de connexion

- Dans le tableau de bord, allez dans "Connection Details" ou "Database"
- Copiez la nouvelle URL de connexion (elle peut avoir changé)
- Vérifiez que vous utilisez la bonne URL (pooler vs direct)

### 4. Mettez à jour votre fichier .env

Remplacez la ligne DATABASE_URL dans votre fichier .env avec la nouvelle URL copiée depuis Neon.

### 5. URLs à essayer

Si vous obtenez plusieurs URLs depuis Neon, essayez dans cet ordre :

1. **URL avec pooler** (recommandée pour les applications) :

    ```
    postgresql://neondb_owner:PASSWORD@HOST-pooler.REGION.aws.neon.tech/DATABASE?sslmode=require
    ```

2. **URL directe** (pour les migrations et outils) :
    ```
    postgresql://neondb_owner:PASSWORD@HOST.REGION.aws.neon.tech/DATABASE?sslmode=require
    ```

### 6. Testez la connexion

Après avoir mis à jour l'URL, testez avec :

```bash
node test-db-connection.js
```

## Si le problème persiste

### Option A : Créer une nouvelle base de données

- Dans votre tableau de bord Neon, créez une nouvelle base de données
- Utilisez les nouveaux credentials

### Option B : Contacter le support Neon

- Si votre base de données semble active mais ne répond toujours pas
- Vérifiez les status pages de Neon pour des problèmes de service

### Option C : Utiliser une base de données locale temporairement

- Installez PostgreSQL localement
- Utilisez une URL locale pour le développement

## Commandes utiles après résolution

Une fois la connexion rétablie :

```bash
# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma migrate dev --name init_db_postgres

# Voir l'état de la base de données
npx prisma studio
```

## Notes importantes

- Les bases de données Neon se mettent automatiquement en veille après inactivité
- Le plan gratuit a des limitations sur le temps d'activité
- Gardez toujours une sauvegarde de vos données importantes
