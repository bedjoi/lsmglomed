import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        const { title } = await req.json();
        console.log("le UserId est " + userId, "le title est " + title);
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }
        const course = await db.course.create({
            data: {
                title,
                userId,
            },
        });
        return NextResponse.json(course, { status: 201 });
    } catch (error) {
        console.log(["Error creating course:"], error);
        return new NextResponse(
            "Failed to create course, internal server error",
            { status: 500 }
        );
    }
}
