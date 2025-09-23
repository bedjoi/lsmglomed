import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request, props: { params: Promise<{ courseId: string }> }) {
    const params = await props.params;
    try {
        const { userId } = await auth();
        console.log(userId);
        const { url } = await req.json();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const courseOwner = await db.course.findUnique({
            where: { id: params.courseId, userId: userId },
        });
        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const attachment = await db.attachment.create({
            data: {
                url,
                name: url.split("/").pop(),
                courseId: params.courseId,
            },
        });
        console.log(attachment);
        return NextResponse.json(attachment);
    } catch (error) {
        console.log("Error in attachments route: ", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
