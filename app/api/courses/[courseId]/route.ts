import Mux from "@mux/mux-node";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

interface PageProps {
    params: Promise<{ courseId: string }>;
}
const mux = new Mux({
    tokenId: process.env.MUX_TOKEN_ID!,
    tokenSecret: process.env.MUX_TOKEN_SECRET!,
});
const { video } = mux;

export async function DELETE(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorised", { status: 401 });
        }
        const course = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId,
            },
            include: {
                chapters: {
                    include: {
                        muxData: true,
                    },
                },
            },
        });
        if (!course) {
            return new NextResponse("Not found", { status: 404 });
        }
        for (const chapter of course.chapters) {
            if (chapter.muxData?.assetId) {
                await video.assets.delete(chapter.muxData.assetId);
            }
        }
        const deletedCourse = await db.course.delete({
            where: {
                id: params.courseId,
            },
        });
        return NextResponse.json(deletedCourse);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(req: Request, props: PageProps) {
    const params = await props.params;
    try {
        const { userId } = await auth();
        const courseId = await params.courseId;
        const values = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const course = await db.course.update({
            where: { id: courseId, userId },
            data: {
                ...values,
            },
        });
        return NextResponse.json(course);
    } catch (error) {
        console.log("[COURSE PATCH ERROR]", error);
        return new NextResponse("Failed to update course", { status: 500 });
    }
}
