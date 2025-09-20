import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const CourseLayout = async ({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { courseId: string };
}) => {
    const { userId } = await auth();

    if (!userId) {
        // Redirect to home page if not authenticated
        return redirect("/");
    }

    const course = await db.course.findUnique({
        where: {
            id: params.courseId,
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

    return <div>{children}</div>;
};

export default CourseLayout;
