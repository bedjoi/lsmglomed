const { Client } = require("pg");
require("dotenv").config();

async function wakeUpDatabase() {
    console.log("🌅 Tentative de réveil de la base de données Neon...");

    const dbUrl = process.env.DATABASE_URL;
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
        attempts++;
        console.log(`\n🔄 Tentative ${attempts}/${maxAttempts}...`);

        // Créer un nouveau client pour chaque tentative
        const client = new Client({
            connectionString: dbUrl,
            connectionTimeoutMillis: 30000, // 30 secondes
        });

        try {
            await client.connect();
            console.log("✅ Base de données réveillée avec succès !");

            // Test simple
            const result = await client.query("SELECT NOW() as wake_time");
            console.log(
                "⏰ Base de données active à:",
                result.rows[0].wake_time
            );

            await client.end();
            return true;
        } catch (error) {
            console.log(`❌ Tentative ${attempts} échouée:`, error.message);

            // S'assurer que le client est fermé même en cas d'erreur
            try {
                await client.end();
            } catch (e) {
                // Ignorer les erreurs de fermeture
            }

            if (attempts < maxAttempts) {
                console.log(
                    "⏳ Attente de 10 secondes avant la prochaine tentative..."
                );
                await new Promise((resolve) => setTimeout(resolve, 10000));
            }
        }
    }

    console.log("\n💤 La base de données semble toujours en veille.");
    console.log("📋 Actions recommandées:");
    console.log("   1. Connectez-vous à https://console.neon.tech");
    console.log("   2. Sélectionnez votre projet 'glomed'");
    console.log("   3. Vérifiez l'état de votre base de données");
    console.log("   4. Réactivez-la manuellement si nécessaire");
    console.log("   5. Vérifiez vos credentials de connexion");

    return false;
}

wakeUpDatabase();
