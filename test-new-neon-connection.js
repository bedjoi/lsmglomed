const { Client } = require("pg");

async function testConnection() {
    // URL actuelle avec channel_binding
    const urlWithChannelBinding =
        "postgresql://neondb_owner:npg_OwB3W4zTLpAy@ep-round-dust-adcet4d2-pooler.c-2.us-east-1.aws.neon.tech/glomed?sslmode=require&channel_binding=require";

    // URL sans channel_binding (recommandée)
    const urlWithoutChannelBinding =
        "postgresql://neondb_owner:npg_OwB3W4zTLpAy@ep-round-dust-adcet4d2-pooler.c-2.us-east-1.aws.neon.tech/glomed?sslmode=require";

    // URL directe (sans pooler)
    const directUrl =
        "postgresql://neondb_owner:npg_OwB3W4zTLpAy@ep-round-dust-adcet4d2.c-2.us-east-1.aws.neon.tech/glomed?sslmode=require";

    console.log("🔍 Test de connexion à la nouvelle base Neon...\n");

    // Test 1: Avec channel_binding
    console.log("📡 Test 1: Avec channel_binding=require");
    try {
        const client1 = new Client({ connectionString: urlWithChannelBinding });
        await client1.connect();
        console.log("✅ Connexion réussie avec channel_binding");
        await client1.end();
    } catch (error) {
        console.log("❌ Échec avec channel_binding:", error.message);
    }

    // Test 2: Sans channel_binding
    console.log("\n📡 Test 2: Sans channel_binding");
    try {
        const client2 = new Client({
            connectionString: urlWithoutChannelBinding,
        });
        await client2.connect();
        console.log("✅ Connexion réussie sans channel_binding");
        await client2.end();
    } catch (error) {
        console.log("❌ Échec sans channel_binding:", error.message);
    }

    // Test 3: URL directe
    console.log("\n📡 Test 3: URL directe (sans pooler)");
    try {
        const client3 = new Client({ connectionString: directUrl });
        await client3.connect();
        console.log("✅ Connexion réussie avec URL directe");
        await client3.end();
    } catch (error) {
        console.log("❌ Échec avec URL directe:", error.message);
    }
}

testConnection().catch(console.error);
