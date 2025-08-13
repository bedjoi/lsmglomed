"use client"

import * as z from "zod"
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Course } from "@prisma/client";

interface imageFormProps {
    initialData: Course;
    courseId: string;
}

const formSchema = z.object({
    imageUrl: z.string().min(1,{message: "image is required and must be between 2 and 100 characters."}).max(100),
})


export const ImageForm = ({ initialData, courseId }: imageFormProps) => {
    // Form state
    const [ isEditing, setIsEditing ] = useState(false);

    const router = useRouter();

    //form function
    const toggleEdit = () => setIsEditing(current => !current);


    const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
        defaultValues: {
        imageUrl : initialData?.imageUrl || ""
    },
    })
    const { isSubmitting,isValid } = form.formState
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values)
            toast.success("Course image updated successfully.")
            toggleEdit();
            router.refresh();

        } catch (error) {
            toast.error("Failed to update course image.")
            console.log(error)
        }
        console.log(values)
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                image Du Cours
                <Button variant="ghost" onClick={toggleEdit}>
                    {isEditing  && (
                        <span>Annuler</span>
                    )}
                    {!isEditing && !initialData.imageUrl && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Ajouter Image
                        </>
                    ) }
                    {!isEditing && initialData.imageUrl && (
                        <Pencil className="h-4 w-4 mr-2">Modifier</Pencil>
                    )}
                </Button>
            </div>
            {!isEditing && !initialData.imageUrl ?(
                <div className=" flex justify-center items-center bg-slate-200 h-60 rounded-md ">
                    <ImageIcon className="h-10 w-10 text-slate-500"/>
                </div>
            ):(
            <div>
                curent image
            </div>
            )}
            {
                isEditing && (
                     <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea placeholder="image" {...field} />
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