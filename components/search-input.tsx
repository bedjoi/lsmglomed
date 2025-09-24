"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import qs from "query-string";

export const SearchInput = () => {
    const [value, setValue] = useState("");
    const searchParams = useSearchParams();
    const debouncedValue = useDebounce(value);
    const router = useRouter();
    const pathName = usePathname();
    const currentCategoryId = searchParams.get("categoryId");
    useEffect(() => {
        if (debouncedValue) {
            const url = qs.stringifyUrl(
                {
                    url: pathName,
                    query: {
                        categoryId: currentCategoryId,
                        title: debouncedValue,
                    },
                },
                { skipEmptyString: true, skipNull: true }
            );

            router.push(url);
        }
    }, [debouncedValue, currentCategoryId, router, pathName]);

    return (
        <div className="relative">
            <Search className="h-4 w-4 absolute top-3 left-3 text-slate-600" />
            <Input
                onChange={(e) => setValue(e.target.value)}
                value={value}
                className="w-full md:w-[400px] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200"
                placeholder="Search for a course"
            />
        </div>
    );
};
