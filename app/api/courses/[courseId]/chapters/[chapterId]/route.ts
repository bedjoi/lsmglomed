import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string } }
) {
    try {
        const { userId } = await auth();
        const { isPublished, ...values } = await req.json();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const ownCorse = await db.course.findUnique({
            where: { id: params.courseId, userId },
        });
        if (!ownCorse) {
            return new NextResponse("You do not own this course", {
                status: 403,
            });
        }

        // Create new chapter
        const chapter = await db.chapter.update({
            where: { id: params.chapterId, courseId: params.courseId },
            data: {
                ...values,
            },
        });
        // TODO: handle isPublished separately and Video Upload
        return NextResponse.json(chapter);
    } catch (error) {
        // console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
