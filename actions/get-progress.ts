import { db } from "@/lib/db";
export const getProgress = async (
    courseId: string,
    userId: string
): Promise<number> => {
    try {
        const publishedChapters = await db.chapter.findMany({
            where: {
                courseId,
                isPublished: true,
            },
            select: { id: true },
        });
        const publishedChapterIds = publishedChapters.map(
            (chapter) => chapter.id
        );
        const validCompletedChapters = await db.userProgress.count({
            where: {
                userId,
                chapterId: {
                    in: publishedChapterIds,
                },
                isCompleted: true,
            },
        });
        const progressPourcentage = publishedChapters
            ? Math.round(
                  (validCompletedChapters / publishedChapterIds.length) * 100
              )
            : 0;
        return progressPourcentage;
    } catch (error) {
        console.error("Error getting progress:", error);
        return 0;
    }
};
