import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

interface PageProps {
    params: Promise<{ courseId: string }>;
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
