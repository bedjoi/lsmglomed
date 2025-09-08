import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import { includes } from "zod";

const ChapterIdPage = async ({
    params,
}: {
    params: { courseId: string; chapterId: string };
}) => {
    const { userId } = await auth();
    if (!userId) {
        return redirect("/");
    }
    const chapter = await db.chapter.findFirst({
        where: {
            id: params.chapterId,
            courseId: params.courseId,
        },
        include: {
            muxData: true,
        },
    });
    if (!chapter) {
        return redirect(`/teacher/courses/${params.courseId}`);
    }

    //fetch chapter details here if needed using params.chapterId
    return <div>Chapter ID Page: {params.chapterId}</div>;
};

export default ChapterIdPage;
