"use client ";
import Image from "next/image";
import React from "react";
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
        <div className="border  p-4 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-sm text-gray-600 mb-4">
                {category ? category.name : "Uncategorized"}
            </p>
            <p className="text-gray-700">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={title}
                        width={400}
                        height={100}
                        className="rounded-md "
                    />
                ) : (
                    "No image available."
                )}
            </p>
            <p className="text-gray-700">
                {price !== null ? `$${price.toFixed(2)}` : "Free"}
            </p>
            <p className="text-gray-700">
                {chapterLength} chapter{chapterLength !== 1 ? "s" : ""}
            </p>
            {progress !== null && (
                <p className="text-green-600">
                    Progress: {progress.toFixed(2)}%
                </p>
            )}
        </div>
    );
};

export default CourseCard;
