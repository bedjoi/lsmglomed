import { Category, Course } from "@prisma/client";
import CourseCard from "./course-card";

export const CoursesList = ({
    items,
}: {
    items: (Course & {
        category: Category | null;
        chapters?: { id: string }[];
        progress: number | null;
    })[];
}) => {
    return (
        <div>
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
                {items.map((item) => (
                    <CourseCard
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        imageUrl={item.imageUrl!}
                        chapterLength={item.chapters?.length || 0}
                        progress={item.progress}
                        category={item.category}
                        price={item.price}
                    />
                ))}
            </div>
            {items.length === 0 && (
                <p className="text-center text-sm text-muted-foreground text-gray-500 mt-10">
                    No courses found.
                </p>
            )}
        </div>
    );
};
