// const { PrismaClient } = require("@prisma/client");
import { PrismaClient } from "@prisma/client";
const database = new PrismaClient();

async function main() {
    try {
        await database.category.createMany({
            data: [
                { name: "Music Cover" },
                { name: "Mobile Development glomed" },
                { name: "Data Science" },
                { name: "Machine Learning" },
                { name: "Cloud Computing" },
            ],
        });
        console.log("Database categories seeded successfully");
    } catch (error) {
        console.log("Error seeding the database categories", error);
    } finally {
        await database.$disconnect();
    }
}
main();
