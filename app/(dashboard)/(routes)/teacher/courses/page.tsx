import { Button } from "@/components/ui/button";
import Link from "next/link";
import DemoPage from "./_components/page";

const CoursesPage = () => {
    return (
        <div className="p-6">
            <Link href={"/teacher/create"}>
                <Button className="mt-4">Create New Course</Button>
            </Link>
            <DemoPage />
        </div>
    );
};

export default CoursesPage;
