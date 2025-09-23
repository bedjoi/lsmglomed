import React from "react";
import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";
import { auth } from "@clerk/nextjs/server";
// import { VideoPlayer } from "@/components/video-player";
import { Separator } from "@/components/ui/separator";
import { redirect } from "next/navigation";
import VideoPlayer from "./_components/video-player";
import CourseEnrollButton from "./_components/course-enroll-button";
import { Preview } from "@/components/preview";

export default async function ChapterIdPage({
    params,
}: {
    params: { chapterId: string; courseId: string };
}) {
    const { chapterId, courseId } = await params;
    const { userId } = await auth();

    if (!userId) {
        // Redirect to home
        // page if not authenticated
        return redirect("/");
    }
    const {
        chapter,
        course,
        muxData,
        attachments,
        nextChapter,
        userProgress,
        purchase,
        playbackId,
    } = await getChapter({
        userId,
        chapterId: chapterId,
        courseId: courseId,
    });
    if (!chapter || !course) {
        return redirect("/");
    }
    const isLocked = !chapter.isFree && !purchase;
    const completeOnEnd = !!purchase && !userProgress?.isCompleted;

    return (
        <div>
            {userProgress?.isCompleted && (
                <Banner
                    variant={"success"}
                    className="mb-4"
                    label="You already completed this chapter."
                />
            )}
            {isLocked && (
                <Banner
                    variant={"warning"}
                    className="mb-4"
                    label="You need to purchase the course to access this chapter."
                />
            )}
            <div className="flex flex-col max-w-4xl mx-auto pb-20">
                <div className="p-4">
                    <VideoPlayer
                        chapterId={chapterId}
                        title={chapter.title}
                        courseId={courseId}
                        nextChapterId={nextChapter?.id || ""}
                        playbackId={muxData?.playbackId || ""}
                        isLocked={isLocked}
                        completeOnEnd={completeOnEnd}
                    />
                </div>
                <div></div>
                <div className="p-4 flex flex-col md:flex-row items-center justify-between">
                    <h1 className="text-2xl font-bold mb-4 md:mb-0">
                        {chapter.title}
                    </h1>
                    {purchase ? (
                        <p>You have access to this chapter.</p>
                    ) : (
                        <CourseEnrollButton
                            courseId={params.courseId!}
                            price={course.price!}
                        />
                    )}
                </div>
                <Separator />
                <div>
                    <Preview value={chapter.description!} />
                </div>
                {attachments.length > 0 && (
                    <>
                        <Separator />
                        <div className="flex space-x-2">
                            {attachments.map((attachment) => (
                                <a
                                    key={attachment.id}
                                    href={attachment.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                                >
                                    <p className="line-clamp-1">
                                        {attachment.name}
                                    </p>
                                </a>
                            ))}
                        </div>
                    </>
                )}

                <div className="p-4 prose max-w-none"></div>
            </div>
        </div>
    );
}
