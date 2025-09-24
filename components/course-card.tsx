"use client ";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { IconBadge } from "@/components/icon-badge";
import { BookOpen } from "lucide-react";
interface CourseCardProps {
    id: string;
    title: string;
    imageUrl: string;
    chapterLength: number;
    progress: number | null;
    category: { id: string; name: string } | null;
    price: number | null;
}

const CourseCard = ({
    id,
    title,
    imageUrl,
    chapterLength,
    progress,
    category,
    price,
}: CourseCardProps) => {
    return (
        <Link href={`/courses/${id}`}>
            <div className="group hover:shadow-sm transition overflow-hidden rounded-lg p-3 h-full">
                <div className="relative w-full aspect-video rounded-md overflow-hidden">
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={title}
                            width={200}
                            height={100}
                            className="rounded-md object-cover w-full h-40 mb-4 bg-gray-200 group-hover:scale-105 transition"
                        />
                    ) : (
                        "No image available."
                    )}
                </div>
                <div className="flex flex-col pt-2">
                    <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
                        {title}{" "}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {category?.name}
                    </p>
                    <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
                        <div className="flex items-center gap-x-1 text-slate-500">
                            <IconBadge size="sm" icon={BookOpen} />
                            {chapterLength}
                            {chapterLength === 1 ? " Chapter" : " Chapters"}
                        </div>
                    </div>
                    {progress !== null ? (
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                            <div
                                className="bg-sky-600 h-2.5 rounded-full transition-all"
                                style={{ width: `${progress}%` }}
                            />
                            <p>{progress}%</p>
                        </div>
                    ) : price !== null ? (
                        <div className="text-sm font-semibold text-slate-700">
                            {price === 0 ? "Free" : `$${price.toFixed(2)}`}
                        </div>
                    ) : null}
                </div>
            </div>
        </Link>
    );
};

export default CourseCard;
