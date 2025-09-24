"use client";

import * as z from "zod";
import axios from "axios";
import MuxPlayer from "@mux/mux-player-react";
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
import { Pencil, PlusCircle, Video } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Chapter, MuxData } from "@prisma/client";
import { SingleImageDropzone } from "@/components/(edgefile)/single-image-dropzone";
import { useEdgeStore } from "@/lib/edgestore";
import { Input } from "@/components/ui/input";
import { is } from "zod/v4/locales";

interface ChapterVideosProps {
    initialData: Chapter & { muxData?: MuxData | null };
    courseId: string;
    chapterId: string;
}

const formSchema = z.object({
    videoUrl: z.string().min(1),
});

export const ChapterVideosForm = ({
    initialData,
    courseId,
    chapterId,
}: ChapterVideosProps) => {
    const [file, setFile] = useState<File>();
    const [progress, setProgress] = useState<number>(0);
    const [url, setUrl] = useState<string | null>(null);
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
            videoUrl: initialData?.videoUrl || "",
        },
    });
    const { isSubmitting, isValid } = form.formState;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values);
        try {
            await axios.patch(
                `/api/courses/${courseId}/chapters/${chapterId}`,
                values
            );
            toast.success("VideoChapter updated successfully.");
            toggleEdit();
            router.refresh();
        } catch (error) {
            toast.error("Failed to update VideoChapter.");
            console.log(error);
        }
        console.log(values);
    };

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Video Du Cours
                <Button variant="ghost" onClick={toggleEdit}>
                    {isEditing && <span>Annuler</span>}
                    {!isEditing && !initialData.videoUrl && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Ajouter Video
                        </>
                    )}
                    {!isEditing && initialData.videoUrl && (
                        <Pencil className="h-4 w-4 mr-2">Modifier</Pencil>
                    )}
                </Button>
            </div>
            {!isEditing &&
                (!initialData?.videoUrl ? (
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                        <Video className="h-10 w-10 text-slate-500" />
                    </div>
                ) : initialData?.muxData?.playbackId ? (
                    <MuxPlayer playbackId={initialData.muxData.playbackId} />
                ) : (
                    <iframe
                        src={initialData.videoUrl}
                        className="w-full h-60 rounded-md border"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="Chapter Video"
                    />
                ))}
            {isEditing && (
                <div className="flex flex-col justify-center items-center bg-slate-200  rounded-md ">
                    <SingleImageDropzone
                        width={100}
                        height={100}
                        value={file}
                        dropzoneOptions={{
                            accept: { "video/*": [] },
                            maxSize: 1024 * 1024 * 200, // 200MB
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
                                if (!file) return;
                                // retry upload up to 3 times with exponential backoff
                                const uploadWithRetry = async () => {
                                    const maxAttempts = 3;
                                    let lastError: unknown;
                                    for (
                                        let attempt = 1;
                                        attempt <= maxAttempts;
                                        attempt++
                                    ) {
                                        try {
                                            return await edgestore.myPublicVideos.upload(
                                                {
                                                    file,
                                                    input: { type: "post" },
                                                    onProgressChange: (
                                                        progress: number
                                                    ) => {
                                                        setProgress(progress);
                                                    },
                                                }
                                            );
                                        } catch (err) {
                                            lastError = err;
                                            // small backoff: 0.5s, 1s
                                            if (attempt < maxAttempts) {
                                                const delayMs = 500 * attempt;
                                                await new Promise((r) =>
                                                    setTimeout(r, delayMs)
                                                );
                                            }
                                        }
                                    }
                                    throw lastError;
                                };

                                try {
                                    const res = await uploadWithRetry();
                                    setUrl(res.url);
                                    try {
                                        await axios.patch(
                                            `/api/courses/${courseId}/chapters/${chapterId}`,
                                            { videoUrl: res.url }
                                        );
                                        toast.success(
                                            "Chapitre: vidéo mise à jour avec succès."
                                        );
                                        router.refresh();
                                        setIsClickedBtnUpload(true);
                                        setIsEditing(false);
                                    } catch (error) {
                                        toast.error(
                                            "Échec de la mise à jour de la vidéo du chapitre."
                                        );
                                        console.log(error);
                                    }
                                } catch (error) {
                                    toast.error(
                                        "Échec du téléversement (EdgeStore). Veuillez réessayer."
                                    );
                                    console.log(error);
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
                                        name="videoUrl"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input
                                                        placeholder="videoUrl"
                                                        {...field}
                                                        value={url || ""}
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
                    {initialData?.videoUrl && !isEditing && (
                        <div className="mt-2 text-xs text-muted-foreground">
                            Videos can take a few minutes to process. refresh
                            the page if video does not appear.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
