import { Mux } from "@mux/mux-node";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const mux = new Mux({
    tokenId: process.env.MUX_TOKEN_ID!,
    tokenSecret: process.env.MUX_TOKEN_SECRET!,
});
const { Video } = mux;

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
        if (values.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where: { chapterId: params.chapterId },
            });
            if (existingMuxData) {
                // If MuxData exists, delete the existing video from Mux
                await Video.Assets.del(existingMuxData.assetId);
                // Then, delete the existing MuxData record from the database
                await db.muxData.delete({ where: { id: existingMuxData.id } });
            }

            // Create new Mux Asset
            const asset = await Video.Assets.create({
                input: values.videoUrl,
                playback_policy: "public",
                test: false,
            });
            await db.muxData.create({
                data: {
                    assetId: asset.id,
                    playbackId: asset.playback_ids[0]?.id,
                    chapterId: chapter.id,
                },
            });
        }

        return NextResponse.json(chapter);
    } catch (error) {
        // console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
