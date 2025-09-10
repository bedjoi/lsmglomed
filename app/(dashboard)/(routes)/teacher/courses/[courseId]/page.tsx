import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import {
    CircleDollarSign,
    File,
    LayoutDashboard,
    ListCheck,
} from "lucide-react";
import { redirect } from "next/navigation";
import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";
import { AttachmentForm } from "./_components/attachment-form";
import { CategoryForm } from "./_components/category-form";
import { PriceForm } from "./_components/price-form";
import { ImageForm } from "./_components/image-form";
import { ChaptersForm } from "./_components/chapters-form";
import { auth } from "@clerk/nextjs/server";

interface PageProps {
    params: Promise<{ courseId: string }>;
}
const courseIdPage = async (props: PageProps) => {
    const params = await props.params;
    const { userId } = await auth();
    if (!userId) {
        return redirect("/");
    }

    const course = await db.course.findUnique({
        where: {
            id: params.courseId,
            userId: userId,
        },
        include: {
            chapters: {
                orderBy: {
                    position: "asc",
                },
            },
            attachments: {
                orderBy: {
                    createdAt: "desc",
                },
            },
        },
    });
    const categories = await db.category.findMany({
        orderBy: {
            name: "asc",
        },
    });
    console.log(categories);
    if (!course) {
        return redirect("/");
    }
    const requiredFields = [
        course.title,
        course.description,
        course.imageUrl,
        course.price,
        course.categoryId,
        course.chapters.some((chapter) => chapter.isPublished),
    ];
    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;
    const completionText = `(${completedFields}/${totalFields})`;
    return (
        <div className="p-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-y-2">
                    <h1 className="text-2xl font-medium">Course Setup</h1>
                    <span className="text-sm text-muted-foreground">
                        Complete tout les entrés {completionText}
                    </span>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                <div>
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={LayoutDashboard} />
                        <h1 className="text-xl">Personaliser Ton Cour</h1>
                    </div>
                    <TitleForm initialData={course} courseId={course.id} />
                    <DescriptionForm
                        initialData={{ description: course.description || "" }}
                        courseId={course.id}
                    />
                    <ImageForm initialData={course} courseId={course.id} />
                    <CategoryForm
                        initialData={course}
                        courseId={course.id}
                        options={categories.map((category) => ({
                            value: category.id,
                            label: category.name,
                        }))}
                    />
                </div>
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-x-2 mb-4">
                            <IconBadge icon={ListCheck} />
                            <h2 className="text-xl">Course Chapter</h2>
                        </div>
                        <ChaptersForm
                            initialData={course}
                            courseId={course.id}
                        />
                    </div>
                    <div>
                        <div className="flex items-center gap-x-2 mb-4">
                            <IconBadge icon={CircleDollarSign} />
                            <h2 className="text-xl">Sell your course</h2>
                        </div>
                    </div>
                    <PriceForm initialData={course} courseId={course.id} />
                    <div>
                        <div>
                            <div className="flex items-center gap-x-2 mb-4">
                                <IconBadge icon={File} />
                                <h2 className="text-xl">
                                    Resources & attachments{" "}
                                </h2>
                            </div>
                        </div>
                        <AttachmentForm
                            initialData={course}
                            courseId={course.id}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default courseIdPage;
