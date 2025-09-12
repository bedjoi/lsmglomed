"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface ChapterActionsProps {
    courseId: string;
    chapterId: string;
    isComplete: boolean;
    isPublished: boolean;
    disabled?: boolean;
}

export const ChapterActions = ({
    courseId,
    chapterId,
    isComplete,
    isPublished,
    disabled,
}: ChapterActionsProps) => {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const onDelete = async () => {
        try {
            setIsLoading(true);
            await axios.delete(
                `/api/courses/${courseId}/chapters/${chapterId}`
            );
            toast.success("Chapter deleted");
            router.refresh();
            router.push(`/teacher/courses/${courseId}`);
        } catch (error) {
            toast.error("Something went wrong.");
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="flex space-x-2">
            <Button
                onClick={() => {}}
                disabled={disabled || isLoading}
                variant={"outline"}
                size={"sm"}
            >
                {isPublished ? "Unpublish" : "Publish"}
            </Button>
            <ConfirmModal onConfirm={onDelete}>
                <Button variant="outline" size={"sm"} disabled={isLoading}>
                    <Trash className="mr-2 h-4 w-4" />
                </Button>
            </ConfirmModal>
        </div>
    );
};
