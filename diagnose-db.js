const { Client } = require("pg");
require("dotenv").config();

async function diagnoseConnection() {
    console.log("🔍 Diagnostic de la connexion à la base de données");
    console.log("=".repeat(50));

    // Afficher l'URL de connexion (masquée pour la sécurité)
    const dbUrl = process.env.DATABASE_URL;
    if (dbUrl) {
        const maskedUrl = dbUrl.replace(/:([^:@]+)@/, ":****@");
        console.log("📍 URL de connexion:", maskedUrl);
    } else {
        console.log("❌ Aucune DATABASE_URL trouvée dans .env");
        return;
    }

    // Extraire les informations de connexion
    try {
        const url = new URL(dbUrl);
        console.log("🏠 Host:", url.hostname);
        console.log("🔌 Port:", url.port || "5432");
        console.log("🗄️  Database:", url.pathname.slice(1));
        console.log("👤 User:", url.username);
        console.log(
            "🔐 SSL Mode:",
            url.searchParams.get("sslmode") || "non spécifié"
        );
    } catch (error) {
        console.log("❌ Erreur lors du parsing de l'URL:", error.message);
        return;
    }

    console.log("\n🔄 Test de connexion...");

    const client = new Client({
        connectionString: dbUrl,
        connectionTimeoutMillis: 10000, // 10 secondes
    });

    try {
        console.log("⏳ Connexion en cours...");
        await client.connect();
        console.log("✅ Connexion réussie !");

        // Test de requête simple
        const result = await client.query(
            "SELECT version(), now() as current_time"
        );
        console.log(
            "🎯 Version PostgreSQL:",
            result.rows[0].version.split(" ")[0] +
                " " +
                result.rows[0].version.split(" ")[1]
        );
        console.log("⏰ Heure du serveur:", result.rows[0].current_time);

        // Test de création de table (pour vérifier les permissions)
        try {
            await client.query(
                "CREATE TABLE IF NOT EXISTS test_connection (id SERIAL PRIMARY KEY, created_at TIMESTAMP DEFAULT NOW())"
            );
            await client.query("DROP TABLE test_connection");
            console.log("✅ Permissions de création/suppression: OK");
        } catch (permError) {
            console.log("⚠️  Permissions limitées:", permError.message);
        }
    } catch (error) {
        console.log("❌ Erreur de connexion:", error.message);
        console.log("🔍 Code d'erreur:", error.code);

        // Suggestions basées sur le type d'erreur
        if (error.code === "ECONNRESET") {
            console.log("\n💡 Suggestions pour ECONNRESET:");
            console.log("   - La base de données Neon est peut-être en veille");
            console.log("   - Vérifiez votre tableau de bord Neon");
            console.log("   - Essayez de réactiver la base de données");
            console.log("   - Vérifiez vos credentials");
        } else if (error.code === "ENOTFOUND") {
            console.log("\n💡 Suggestions pour ENOTFOUND:");
            console.log("   - Vérifiez l'URL du serveur");
            console.log("   - Problème de réseau ou DNS");
        } else if (error.code === "ECONNREFUSED") {
            console.log("\n💡 Suggestions pour ECONNREFUSED:");
            console.log("   - Le serveur refuse la connexion");
            console.log("   - Vérifiez le port et l'adresse");
        }
    } finally {
        try {
            await client.end();
        } catch (e) {
            // Ignore les erreurs de fermeture
        }
    }
}

diagnoseConnection();
