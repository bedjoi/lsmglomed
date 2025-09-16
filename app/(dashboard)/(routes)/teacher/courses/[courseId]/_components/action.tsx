"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/use-confetti-store";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface ActionProps {
    courseId: string;
    isPublished: boolean;
    disabled?: boolean;
}

export const Action = ({ courseId, isPublished, disabled }: ActionProps) => {
    const router = useRouter();
    const confetti = useConfettiStore();

    const [isLoading, setIsLoading] = useState(false);
    const onClick = async () => {
        try {
            if (courseId) {
                setIsLoading(true);
                if (isPublished) {
                    await axios.patch(`/api/courses/${courseId}/unpublish`);
                    toast.success("Course Unpublished");
                } else {
                    await axios.patch(`/api/courses/${courseId}/publish`);
                    toast.success("Course Published");
                    confetti.onOpen();
                }
                router.refresh();
            }
        } catch (error) {
            toast.error("something went wrong");
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };
    const onDelete = async () => {
        try {
            setIsLoading(true);
            await axios.delete(`/api/courses/${courseId}`);
            toast.success("Course deleted");
            router.refresh();
            router.push(`/teacher/courses`);
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong.");
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="flex space-x-2">
            <Button
                onClick={onClick}
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
