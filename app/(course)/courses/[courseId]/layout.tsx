import React from "react";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { getProgress } from "@/actions/get-progress";
import { CourseSidebar } from "./_components/course-sidebar";
import { CourseNavbar } from "./_components/course-navbar";
const CourseLayout = async ({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { courseId: string };
}) => {
    const { userId } = await auth();
    const { courseId } = await params;

    if (!userId) {
        // Redirect to home
        // page if not authenticated
        return redirect("/");
    }

    const course = await db.course.findUnique({
        where: {
            id: courseId,
        },
        include: {
            chapters: {
                where: {
                    isPublished: true,
                },
                include: {
                    userProgress: {
                        where: {
                            userId,
                        },
                    },
                },
                orderBy: {
                    position: "asc",
                },
            },
        },
    });

    if (!course) {
        return redirect("/"); // Redirect if course not found
    }
    const progressCount = await getProgress(userId, course.id);

    return (
        <div className="h-full">
            <div className="h-[89px] md:pl-80 fixed inset-y-0 w-full z-50">
                <CourseNavbar course={course} progressCount={progressCount} />
            </div>

            <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
                <CourseSidebar course={course} progressCount={progressCount} />
            </div>

            <main className="md:pl-80 pt-[89px] h-full">{children}</main>
        </div>
    );
};

export default CourseLayout;
