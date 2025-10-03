const { Client } = require("pg");
require("dotenv").config();

async function testConnection() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        console.log("Tentative de connexion à la base de données...");
        await client.connect();
        console.log("✅ Connexion réussie !");

        const result = await client.query("SELECT NOW()");
        console.log("⏰ Heure du serveur:", result.rows[0].now);
    } catch (error) {
        console.error("❌ Erreur de connexion:", error.message);
        console.error("Code d'erreur:", error.code);
    } finally {
        await client.end();
    }
}

testConnection();
