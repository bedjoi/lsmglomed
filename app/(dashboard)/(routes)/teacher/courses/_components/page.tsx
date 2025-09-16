import { auth } from "@clerk/nextjs/server";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export default async function DemoPage() {
    const { userId } = await auth();
    if (!userId) {
        return redirect("/");
    }
    const courses = await db.course.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={courses} />
        </div>
    );
}
