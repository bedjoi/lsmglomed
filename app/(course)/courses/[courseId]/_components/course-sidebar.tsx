import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Chapter, Course, UserProgress } from "@prisma/client";
import { redirect } from "next/navigation";
import { CourseSidebarItem } from "./course-sidebar-item";

interface CourseSidebarProps {
    course: Course & {
        chapters: (Chapter & {
            userProgress: UserProgress[] | null;
        })[];
    };
    progress: number;
}

export const CourseSidebar = async ({
    course,
    progress,
}: CourseSidebarProps) => {
    const { userId } = await auth();
    if (!userId) {
        return redirect("/");
    }
    const purchase = await db.purchase.findUnique({
        where: {
            userId_courseId: {
                userId,
                courseId: course.id,
            },
        },
    });
    return (
        <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
            <div className="p-8 flex flex-col border-b">
                <h1 className="font-semibold">{course.title}</h1>
                {/* Check purchasse and add progress */}
            </div>
            <div className="flex flex-col w-full">
                {
                    course.chapters.map((chapter) => (
                        <CourseSidebarItem
                            key={chapter.id}
                            id={chapter.id}
                            courseId={course.id}
                            label={chapter.title}
                            isCompleted={
                                !!chapter.userProgress?.[0]?.isCompleted
                            }
                            isLocked={!chapter.isFree && !purchase}
                        />
                    )) // Map through chapters
                }
            </div>
        </div>
    );
};
