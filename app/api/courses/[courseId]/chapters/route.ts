import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request, props: { params: Promise<{ courseId: string }> }) {
    const params = await props.params;
    try {
        const { userId } = await auth();
        const { title } = await req.json();

        if (!userId) {
            return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
            });
        }

        if (!title || typeof title !== "string") {
            return new NextResponse(
                JSON.stringify({ error: "Invalid title" }),
                { status: 400 }
            );
        }
        const courseOwner = await db.course.findUnique({
            where: { id: params.courseId, userId },
        });
        if (!courseOwner) {
            return new NextResponse(
                JSON.stringify({ error: "You do not own this course" }),
                { status: 403 }
            );
        }
        const lastChapter = await db.chapter.findFirst({
            where: { courseId: params.courseId },
            orderBy: { position: "desc" },
        });
        const newPosition = lastChapter ? lastChapter.position + 1 : 1;

        // Create the new chapter with the correct position

        const chapter = await db.chapter.create({
            data: {
                title,
                courseId: params.courseId,
                position: newPosition,
            },
        });

        return NextResponse.json(chapter, { status: 201 });
    } catch (error) {
        console.error("Error creating chapter:", error);
        return new NextResponse(
            JSON.stringify({ error: "Internal Server Error" }),
            { status: 500 }
        );
    }
}
