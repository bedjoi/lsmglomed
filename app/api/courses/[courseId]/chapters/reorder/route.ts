import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(request: Request, props: { params: Promise<{ courseId: string }> }) {
    const params = await props.params;
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const { list } = await request.json();
        if (!Array.isArray(list) || list.length === 0) {
            return new NextResponse("Invalid data", { status: 400 });
        }

        // Update each chapter's position
        await Promise.all(
            list.map(async (item: { id: string; position: number }) => {
                await db.chapter.update({
                    where: { id: item.id, courseId: params.courseId },
                    data: { position: item.position },
                });
            })
        );

        return new NextResponse("Chapters reordered successfully", {
            status: 200,
        });
    } catch (error) {
        console.error("Error reordering chapters:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
