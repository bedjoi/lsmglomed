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
import { Loader2, PlusCircle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Chapter, Course } from "@prisma/client";
import { ChapterList } from "./chapters-list";

interface chaptersFormProps {
    initialData: Course & { chapters: Chapter[] };
    courseId: string;
}

const formSchema = z.object({
    title: z.string().min(1),
});

export const ChaptersForm = ({ initialData, courseId }: chaptersFormProps) => {
    // Form state
    const [isCreating, setIsCreating] = useState(false);
    // const [isEditing, setIsEditing] = useState(false);

    const [isUpdating, setIsUpdating] = useState(false);

    const router = useRouter();

    //form function
    const toggleCreating = () => setIsCreating((current) => !current);
    // const toggleEdit = () => setIsEditing((current) => !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
        },
    });
    const { isSubmitting, isValid } = form.formState;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/chapters`, values);
            toast.success("Course chapter created successfully.");
            toggleCreating();
            router.refresh();
        } catch (error) {
            toast.error("Failed to create course chapter.");
            console.log(error);
        }
        console.log(values);
    };
    const onReorder = async (
        updateData: { id: string; position: number }[]
    ) => {
        try {
            setIsUpdating(true);
            await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
                list: updateData,
            });
            toast.success("Chapters reordered successfully.");
            router.refresh();
        } catch (error) {
            toast.error("Failed to reorder chapters.");
            console.log(error);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
            {isUpdating && (
                <div className="absolute  h-full w-full bg-slate-500/20 top-0 right-0 rounded-md flex items-center justify-center">
                    <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
                </div>
            )}
            <div className="font-medium flex items-center justify-between">
                Chapitres Du Cours
                <Button variant="ghost" onClick={toggleCreating}>
                    {isCreating ? (
                        <span>Annuler</span>
                    ) : (
                        <PlusCircle className="h-4 w-4 mr-2">
                            Ajouter Un Chapitre
                        </PlusCircle>
                    )}
                </Button>
            </div>

            {isCreating && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g. Introduction"
                                            {...field}
                                        />
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
                                Creer
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
            {!isCreating && (
                <div
                    className={cn(
                        "text-sm mt-2",
                        !initialData.chapters && "text-slate-500 italic"
                    )}
                >
                    {!initialData.chapters && "No chapters created yet."}
                    {/* TODO : Ajouter une liste des chapitres */}
                    <ChapterList
                        onEdit={() => {}}
                        onReorder={onReorder}
                        items={initialData.chapters || []}
                    />
                </div>
            )}
            {!isCreating && (
                <div className="text-xs text-muted-foreground mt-4">
                    Drag and drop to reorder chapters (coming soon).
                </div>
            )}
        </div>
    );
};
