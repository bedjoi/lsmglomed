import Mux from "@mux/mux-node";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const mux = new Mux({
    tokenId: process.env.MUX_TOKEN_ID!,
    tokenSecret: process.env.MUX_TOKEN_SECRET!,
});
const { video } = mux;
export async function DELETE(
    req: Request,
    props: { params: Promise<{ courseId: string; chapterId: string }> }
) {
    const params = await props.params;
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("uUnauthorized", { status: 401 });
        }
        const ownCourse = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId,
            },
        });
        if (!ownCourse) {
            return new NextResponse("Unauthorised", { status: 401 });
        }
        const chapter = await db.chapter.findUnique({
            where: {
                id: params.chapterId,
                courseId: params.courseId,
            },
        });
        if (!chapter) {
            return new NextResponse("Not Found", { status: 404 });
        }
        if (chapter.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId: params.chapterId,
                },
            });

            if (existingMuxData) {
                await video.assets.delete(existingMuxData.assetId);
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id,
                    },
                });
            }
        }
        const deletedChapter = await db.chapter.delete({
            where: {
                id: params.chapterId,
            },
        });
        const publishedChaptersInCourse = db.chapter.findMany({
            where: {
                courseId: params.courseId,
                isPublished: true,
            },
        });
        if (!(await publishedChaptersInCourse).length) {
            await db.course.update({
                where: {
                    id: params.courseId,
                },
                data: {
                    isPublished: false,
                },
            });
        }
        return NextResponse.json(deletedChapter);
    } catch (error) {
        console.log("[CHAPTER_ID_DELETE]", error);
        return new NextResponse("internal error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    context: { params: Promise<{ courseId: string; chapterId: string }> }
) {
    try {
        const { userId } = await auth();
        const { isPublished, ...values } = await req.json();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { courseId, chapterId } = await context.params;

        const ownCorse = await db.course.findUnique({
            where: { id: courseId, userId },
        });
        if (!ownCorse) {
            return new NextResponse("You do not own this course", {
                status: 403,
            });
        }

        // Create new chapter
        const chapter = await db.chapter.update({
            where: { id: chapterId, courseId },
            data: {
                ...values,
            },
        });
        // TODO: handle isPublished separately and Video Upload
        if (values.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where: { chapterId },
            });
            if (existingMuxData) {
                // If MuxData exists, delete the existing video from Mux
                await video.assets.delete(existingMuxData.assetId);
                // Then, delete the existing MuxData record from the database
                await db.muxData.delete({ where: { id: existingMuxData.id } });
            }

            // Create new Mux Asset
            const asset = await video.assets.create({
                inputs: [
                    {
                        url: values.videoUrl,
                    },
                ],
                playback_policy: ["public"],
                test: false,
            });
            await db.muxData.create({
                data: {
                    assetId: asset.id,
                    playbackId: asset.playback_ids?.[0]?.id ?? null,
                    chapterId: chapter.id,
                },
            });
        }

        return NextResponse.json(chapter);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
