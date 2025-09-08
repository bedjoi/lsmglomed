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
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { Editor } from "@/components/editor";
import { Chapter } from "@prisma/client";
import { Preview } from "@/components/preview";

interface chapterDescriptionFormProps {
    initialData: Chapter;
    courseId: string;
    chapterId: string;
}

const formSchema = z.object({
    description: z.string().min(1),
});

export const ChapterDescriptionForm = ({
    initialData,
    courseId,
    chapterId,
}: chapterDescriptionFormProps) => {
    // Form state
    const [isEditing, setIsEditing] = useState(false);

    const router = useRouter();

    //form function
    const toggleEdit = () => setIsEditing((current) => !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { description: initialData.description || "" },
    });
    const { isSubmitting, isValid } = form.formState;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(
                `/api/courses/${courseId}/chapters/${chapterId}`,
                values
            );
            toast.success("Chapterdescription updated successfully.");
            toggleEdit();
            router.refresh();
        } catch (error) {
            toast.error("Failed to update Chapterdescription.");
            console.log(error);
        }
        console.log(values);
    };

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Description Du Chapitre
                <Button variant="ghost" onClick={toggleEdit}>
                    {isEditing ? (
                        <span>Annuler</span>
                    ) : (
                        <Pencil className="h-4 w-4 mr-2">Modifier</Pencil>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <div
                    className={cn(
                        "text-sm mt-2",
                        !initialData.description && "text-slate-500 italic"
                    )}
                >
                    {!initialData.description && "Pas de description"}
                    {initialData.description && (
                        <Preview
                            value={initialData.description}
                            onChange={() => {}}
                        />
                    )}
                </div>
            )}
            {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col gap-4"
                    >
                        <div>
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl className="m-3">
                                            <Editor {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex items-center gap-2 mt-2">
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
