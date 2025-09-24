"use client";

import { cn } from "@/lib/utils";
import { IconType } from "react-icons";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import qs from "query-string";
interface CategoryItemProps {
    label: string;
    icon?: IconType;
    value?: string;
}

export const CategoryItem = ({
    label,
    icon: Icon,
    value,
}: CategoryItemProps) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const currentCategoryId = searchParams.get("categoryId");
    const currentTitle = searchParams.get("title");
    // const currentCategory = pathname.split("/").pop();
    const isSelected = currentCategoryId === value;

    const onClick = () => {
        const url = qs.stringifyUrl(
            {
                url: pathname,
                query: {
                    title: currentTitle,
                    categoryId: isSelected ? null : value,
                },
            },
            { skipNull: true, skipEmptyString: true }
        );
        router.push(url);
    };

    return (
        <button
            onClick={onClick}
            className={cn(
                "py-2 px-3 text-sm border border-slate-200 rounded-md flex items-center gap-x-2 hover:bg-slate-100 transition hover:border-sky-700",
                isSelected && "bg-sky-200/20 border-sky-700 text-sky-800"
            )}
            type="button" // prevent form submission if inside a form element, for accessibility
            value={value}
        >
            {Icon && <Icon className="h-5 w-5" />}
            <span className="text-sm font-medium truncate">{label}</span>
        </button>
    );
};
