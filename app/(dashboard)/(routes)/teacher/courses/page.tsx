import { Button } from "@/components/ui/button";
import Link from "next/link";
import DemoPage from "./_components/page";
import { PlusCircleIcon } from "lucide-react";

const CoursesPage = () => {
    return (
        <div className="p-6">
            <Link href={"/teacher/create"}>
                <Button className="mt-4 cursor-pointer mb-10">
                    <PlusCircleIcon className="mr-2 h-4 w-4" />
                    Create New Course
                </Button>
            </Link>
            <DemoPage />
        </div>
    );
};

export default CoursesPage;
