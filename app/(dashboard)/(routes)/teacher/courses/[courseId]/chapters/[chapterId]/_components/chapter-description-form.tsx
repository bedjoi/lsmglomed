"use client"

import * as z from "zod"
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

interface descriptionFormProps {
    initialData: {
        description: string ;
    };
    courseId: string;
}

const formSchema = z.object({
    description: z.string().min(1,{message: "description is required and must be between 2 and 100 characters."}).max(100),
})


export const DescriptionForm = ({ initialData, courseId }: descriptionFormProps) => {
    // Form state
    const [ isEditing, setIsEditing ] = useState(false);

    const router = useRouter();

    //form function
    const toggleEdit = () => setIsEditing(current => !current);


    const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
    })
    const { isSubmitting,isValid } = form.formState
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values)
            toast.success("Course description updated successfully.")
            toggleEdit();
            router.refresh();

        } catch (error) {
            toast.error("Failed to update course description.")
            console.log(error)
        }
        console.log(values)
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Description Du Cours
                <Button variant="ghost" onClick={toggleEdit}>
                    {isEditing ? (
                        <span>Annuler</span>
                    ) : (
                        <Pencil className="h-4 w-4 mr-2">Modifier</Pencil>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <p className={cn(
                    "text-sm mt-2",
                    !initialData.description && "text-slate-500 italic"
                )}>
                    {initialData.description || "Pas des description"}
                </p>
            )}
            {
                isEditing && (
                     <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea placeholder="description" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                            <div className="flex items-center gap-2 mt-4">
                                 <Button type="submit" disabled={isSubmitting || !isValid}>
                        Save
                    </Button>
                   </div>
                </form>
            </Form>

                )
            }
           
        </div>
    )
}