"use client";

import { Category } from "@prisma/client";
import {
    FcEngineering,
    FcFilmReel,
    FcMultipleDevices,
    // FcReading,
    FcSalesPerformance,
    FcSettings,
    // FcVoicePresentation,
} from "react-icons/fc";
import { IconType } from "react-icons";
import { CategoryItem } from "./category-item";

const iconMap: Record<Category["name"], IconType> = {
    "Music Cover": FcEngineering,
    "Mobile Development glomed": FcMultipleDevices,
    "Data Science": FcSalesPerformance,
    "Machine Learning": FcFilmReel,
    "Cloud Computing": FcSettings,
};

interface CategoriesProps {
    items: Category[];
}

export const Categories = ({ items }: CategoriesProps) => {
    return (
        <div className="flex items-center gap-x-5 overflow-x-auto pb-2">
            {items.map((item) => (
                <CategoryItem
                    key={item.id}
                    label={item.name}
                    icon={iconMap[item.name]}
                    value={item.id}
                />
            ))}
        </div>
    );
};
