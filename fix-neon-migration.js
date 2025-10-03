const { Client } = require("pg");
const fs = require("fs");

async function fixNeonConnection() {
    console.log("🔧 Correction de la configuration Neon PostgreSQL...\n");

    // 1. Corriger le fichier .env
    console.log("📝 Étape 1: Correction du fichier .env");

    const envPath = ".env";
    let envContent = fs.readFileSync(envPath, "utf8");

    // URL recommandée sans channel_binding et avec URL directe
    const newDatabaseUrl =
        'DATABASE_URL="postgresql://neondb_owner:npg_OwB3W4zTLpAy@ep-round-dust-adcet4d2.c-2.us-east-1.aws.neon.tech/glomed?sslmode=require"';
    const newDirectUrl =
        'DIRECT_URL="postgresql://neondb_owner:npg_OwB3W4zTLpAy@ep-round-dust-adcet4d2.c-2.us-east-1.aws.neon.tech/glomed?sslmode=require"';

    // Remplacer la ligne DATABASE_URL actuelle
    envContent = envContent.replace(
        /DATABASE_URL="postgresql:\/\/.*"/,
        newDatabaseUrl
    );

    // Ajouter DIRECT_URL si elle n'existe pas
    if (!envContent.includes("DIRECT_URL=")) {
        envContent = envContent.replace(
            newDatabaseUrl,
            newDatabaseUrl + "\n" + newDirectUrl
        );
    }

    fs.writeFileSync(envPath, envContent);
    console.log("✅ Fichier .env corrigé");

    // 2. Test de connexion avec la nouvelle URL
    console.log("\n📡 Étape 2: Test de connexion");
    const testUrl =
        "postgresql://neondb_owner:npg_OwB3W4zTLpAy@ep-round-dust-adcet4d2.c-2.us-east-1.aws.neon.tech/glomed?sslmode=require";

    let connectionSuccess = false;
    let attempts = 0;
    const maxAttempts = 5;

    while (!connectionSuccess && attempts < maxAttempts) {
        attempts++;
        console.log(`🔄 Tentative ${attempts}/${maxAttempts}...`);

        try {
            const client = new Client({
                connectionString: testUrl,
                connectionTimeoutMillis: 10000,
                query_timeout: 10000,
                statement_timeout: 10000,
            });

            await client.connect();
            console.log("✅ Connexion réussie !");

            // Test simple
            const result = await client.query("SELECT NOW() as current_time");
            console.log("🕒 Heure serveur:", result.rows[0].current_time);

            await client.end();
            connectionSuccess = true;
        } catch (error) {
            console.log(`❌ Tentative ${attempts} échouée:`, error.message);

            if (attempts < maxAttempts) {
                console.log(
                    "⏳ Attente de 5 secondes avant nouvelle tentative..."
                );
                await new Promise((resolve) => setTimeout(resolve, 5000));
            }
        }
    }

    if (!connectionSuccess) {
        console.log("\n🚨 PROBLÈME DÉTECTÉ:");
        console.log(
            "La base de données Neon semble être en mode veille ou inaccessible."
        );
        console.log("\n📋 ACTIONS RECOMMANDÉES:");
        console.log(
            "1. Connectez-vous à votre dashboard Neon: https://console.neon.tech"
        );
        console.log("2. Vérifiez le statut de votre base de données");
        console.log("3. Réactivez la base si elle est en veille");
        console.log("4. Vérifiez que les credentials sont corrects");

        return false;
    }

    return true;
}

async function fixPrismaSchema() {
    console.log("\n🔧 Étape 3: Correction du schéma Prisma");

    const schemaPath = "prisma/schema.prisma";
    let schemaContent = fs.readFileSync(schemaPath, "utf8");

    // Supprimer relationMode = "prisma" pour PostgreSQL
    if (schemaContent.includes('relationMode = "prisma"')) {
        schemaContent = schemaContent.replace(
            /\s*relationMode = "prisma"\s*/,
            ""
        );
        fs.writeFileSync(schemaPath, schemaContent);
        console.log(
            "✅ relationMode supprimé du schéma (non nécessaire pour PostgreSQL)"
        );
    } else {
        console.log("✅ Schéma Prisma déjà correct");
    }
}

async function main() {
    try {
        const connectionOk = await fixNeonConnection();

        if (connectionOk) {
            await fixPrismaSchema();

            console.log("\n🎉 CONFIGURATION TERMINÉE !");
            console.log("\n📋 PROCHAINES ÉTAPES:");
            console.log("1. Générer le client Prisma: npx prisma generate");
            console.log(
                "2. Appliquer les migrations: npx prisma migrate dev --name init_postgres"
            );
            console.log("3. (Optionnel) Voir la base: npx prisma studio");
        } else {
            console.log("\n⚠️  Configuration partielle effectuée.");
            console.log(
                "Résolvez d'abord le problème de connexion Neon avant de continuer."
            );
        }
    } catch (error) {
        console.error("❌ Erreur lors de la configuration:", error.message);
    }
}

main();
