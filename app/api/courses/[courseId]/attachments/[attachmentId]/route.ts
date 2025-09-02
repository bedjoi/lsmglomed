import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    { params }: { params: { courseId: string; attachmentId: string } }
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }
        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId,
            },
        });
        if (!courseOwner) {
            return NextResponse.json(
                { message: "Course not found or you are not the owner" },
                { status: 404 }
            );
        }
        const attachment = await db.attachment.deleteMany({
            where: {
                id: params.attachmentId,
                courseId: params.courseId,
            },
        });
        return NextResponse.json(attachment);
    } catch (error) {
        console.log("[DELETE_ATTACHMENT]", error);
        return NextResponse.json(
            { message: "Failed to delete attachment." },
            { status: 500 }
        );
    }
}
