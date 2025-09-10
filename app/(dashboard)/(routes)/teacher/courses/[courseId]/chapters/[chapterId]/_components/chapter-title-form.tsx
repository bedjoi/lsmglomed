"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface chapterTitleFormProps {
    initialData: {
        title: string;
    };
    courseId: string;
    chapterId: string;
}

const formSchema = z.object({
    title: z
        .string()
        .min(1, {
            message:
                "Title is required and must be between 2 and 100 characters.",
        })
        .max(100),
    // description: z.string().min(10).max(500),
    // imageUrl: z.string().url(),
    // price: z.number().min(0),
    // categoryId: z.string().uuid()
});

export const ChapterTitleForm = ({
    initialData,
    courseId,
    chapterId,
}: chapterTitleFormProps) => {
    // Form state
    const [isEditing, setIsEditing] = useState(false);

    const router = useRouter();

    //form function
    const toggleEdit = () => setIsEditing((current) => !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData,
    });
    const { isSubmitting, isValid } = form.formState;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(
                `/api/courses/${courseId}/chapters/${chapterId}`,
                values
            );
            toast.success("Chapter title updated successfully.");
            toggleEdit();
            router.refresh();
        } catch (error) {
            toast.error("Failed to update Chapter title.");
            console.log(error);
        }
        console.log(values);
        // await axios.patch(`/api/Chapters/${ChapterId}`, data)
    };

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Nom du Chaptitre
                <Button variant="ghost" onClick={toggleEdit}>
                    {isEditing ? (
                        <span>Annuler</span>
                    ) : (
                        <Pencil className="h-4 w-4 mr-2">Modifier</Pencil>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <div>
                    <p>{initialData.title}</p>
                </div>
            )}
            {isEditing && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-2 mt-4">
                            <Button
                                type="submit"
                                disabled={isSubmitting || !isValid}
                            >
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    );
};
