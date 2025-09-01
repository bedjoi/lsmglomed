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
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Course } from "@prisma/client";
import Image from "next/image";
import { SingleImageDropzone } from "@/components/(edgefile)/single-image-dropzone";
import { useEdgeStore } from "@/lib/edgestore";
import Link from "next/link";
import { Input } from "@/components/ui/input";

interface imageProps {
    initialData: Course;
    courseId: string;
}

const formSchema = z.object({
    imageUrl: z
        .string()
        .min(1, {
            message:
                "image is required and must be between 2 and 100 characters.",
        })
        .max(100),
});

export const ImageForm = ({ initialData, courseId }: imageProps) => {
    const [file, setFile] = useState<File>();
    const [progress, setProgress] = useState<number>(0);
    const [urls, setUrls] = useState<{
        url: string;
    }>();
    const { edgestore } = useEdgeStore();
    // Form state
    const [isEditing, setIsEditing] = useState(false);
    const [isClickedBtnUpload, setIsClickedBtnUpload] = useState(false);

    const router = useRouter();

    //form function
    const toggleEdit = () => setIsEditing((current) => !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            imageUrl: initialData?.imageUrl || "",
        },
    });
    const { isSubmitting, isValid } = form.formState;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values);
        try {
            await axios.patch(`/api/courses/${courseId}`, values);
            toast.success("Course image updated successfully.");
            toggleEdit();
            router.refresh();
        } catch (error) {
            toast.error("Failed to update course image.");
            console.log(error);
        }
        console.log(values);
    };

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                image Du Cours
                <Button variant="ghost" onClick={toggleEdit}>
                    {isEditing && <span>Annuler</span>}
                    {!isEditing && !initialData.imageUrl && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Ajouter Image
                        </>
                    )}
                    {!isEditing && initialData.imageUrl && (
                        <Pencil className="h-4 w-4 mr-2">Modifier</Pencil>
                    )}
                </Button>
            </div>
            {!isEditing && initialData?.imageUrl ? (
                <div className="relative mt-2 h-60 w-full rounded-md overflow-hidden">
                    {initialData.imageUrl ? (
                        <Image
                            alt="Upload"
                            fill
                            className="flex mt-2 object-cover center h-10 w-10 rounded-sm"
                            src={initialData.imageUrl}
                        />
                    ) : (
                        <ImageIcon className="h-10 w-10 text-slate-500" />
                    )}
                </div>
            ) : (
                <div className="flex justify-center items-center bg-slate-200 h-60 rounded-md">
                    <ImageIcon className="h-10 w-10 text-slate-500" />
                </div>
            )}
            {isEditing && (
                <div className="flex flex-col justify-center items-center bg-slate-200 h-60 rounded-md ">
                    <SingleImageDropzone
                        width={100}
                        height={100}
                        value={file}
                        dropzoneOptions={{
                            maxSize: 1024 * 1024 * 4, // 1MB
                        }}
                        onChange={(file) => {
                            setFile(file);
                        }}
                    />
                    <div className="h-[6px] w-44 border rounded overflow-hidden">
                        <div
                            className="h-full bg-black transition-all duration-150"
                            style={{
                                width: `${progress}%`,
                            }}
                        />
                    </div>
                    {!isClickedBtnUpload ? (
                        <button
                            className="bg-black text-white rounded px-2 hover:opacity-80"
                            onClick={async () => {
                                if (file) {
                                    const res =
                                        await edgestore.myPublicImages.upload({
                                            file,
                                            input: { type: "post" },
                                            onProgressChange: (p) => {
                                                setProgress(p);
                                            },
                                        });
                                    setUrls({ url: res.url });
                                    // Appelle directement l'API pour mettre à jour l'imageUrl
                                    try {
                                        await axios.patch(
                                            `/api/courses/${courseId}`,
                                            {
                                                imageUrl: res.url,
                                            }
                                        );
                                        toast.success(
                                            "Course image updated successfully."
                                        );
                                        router.refresh();
                                        setIsClickedBtnUpload(true);
                                        setIsEditing(false);
                                    } catch (error) {
                                        toast.error(
                                            "Failed to update course image."
                                        );
                                        console.log(error);
                                    }
                                }
                            }}
                        >
                            Upload
                        </button>
                    ) : (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <div className="hidden">
                                    <FormField
                                        control={form.control}
                                        name="imageUrl"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input
                                                        placeholder="imageUrl"
                                                        {...field}
                                                        value={urls?.url}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
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

                    {/* {urls?.url && (
                        <Link href={urls.url} target="_blank">
                            URL
                        </Link>
                    )} */}
                </div>
            )}
        </div>
    );
};
