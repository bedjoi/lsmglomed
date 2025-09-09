import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, Eye, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import { ChapterTitleForm } from "./_components/chapter-title-form";
import { ChapterDescriptionForm } from "./_components/chapter-description-form";
import { ChapterAccessForm } from "./_components/chapter-access-form";

const ChapterIdPage = async ({
    params,
}: {
    params: { courseId: string; chapterId: string };
}) => {
    const { userId } = await auth();
    const courseId = await params.courseId;
    const chapterId = await params.chapterId;
    if (!userId) {
        return redirect("/");
    }
    const chapter = await db.chapter.findFirst({
        where: {
            id: chapterId,
            courseId: courseId,
        },
        include: {
            muxData: true,
        },
    });
    if (!chapter) {
        return redirect(`/teacher/courses/${courseId}`);
    }
    const requiredFields = [
        chapter.title,
        chapter.description,
        chapter.videoUrl,
    ];
    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;
    const completionText = `(${completedFields}/${totalFields})`;

    //fetch chapter details here if needed using chapterId
    return (
        <div className="p-6">
            <div className="flex items-center justify-between">
                <div className="w-full">
                    <Link
                        href={`/teacher/courses/${courseId}`}
                        className="flex items-center text-sm hover:opacity-75 transition mb-6"
                    >
                        <ArrowLeft className="h-5 w-5 text-slate-700 hover:text-slate-900" />
                    </Link>
                </div>
            </div>
            <div className="flex items-center justify-between w-full">
                <div className="flex flex-col gap-y-2 ">
                    <h1 className="text-2xl font-medium">Chapter Details</h1>
                    <span className="text-sm text-muted-foreground">
                        Complete all entries {completionText}
                    </span>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                <div>
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={LayoutDashboard} />
                        <h2 className="text-xl">Personaliser chapitre</h2>
                    </div>
                    <ChapterTitleForm
                        initialData={{ title: chapter.title || "" }}
                        courseId={courseId}
                        chapterId={chapterId}
                    />

                    <ChapterDescriptionForm
                        initialData={chapter}
                        courseId={courseId}
                        chapterId={chapterId}
                    />
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={Eye} />
                            <h2 className="text-xl">Parametre d&apos;Acces</h2>
                        </div>
                        <ChapterAccessForm
                            initialData={chapter}
                            courseId={courseId}
                            chapterId={chapterId}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChapterIdPage;
