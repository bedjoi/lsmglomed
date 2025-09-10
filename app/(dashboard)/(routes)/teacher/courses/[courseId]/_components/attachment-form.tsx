"use client";

import * as z from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { File, Loader2, PlusCircle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Attachment, Course } from "@prisma/client";
import { SingleImageDropzone } from "@/components/(edgefile)/single-image-dropzone";
import { useEdgeStore } from "@/lib/edgestore";

interface attachmentProps {
    initialData: Course & { attachments: Attachment[] };
    courseId: string;
}

const formSchema = z.object({
    url: z.string().min(1, {
        message: "URL is required and must be at least 1 character long.",
    }),
});

export const AttachmentForm = ({ initialData, courseId }: attachmentProps) => {
    const [file, setFile] = useState<File>();
    const [progress, setProgress] = useState<number>(0);
    const [url, setUrl] = useState<string>();
    const { edgestore } = useEdgeStore();
    // Form state
    const [isEditing, setIsEditing] = useState(false);
    const [isClickedBtnUpload, setIsClickedBtnUpload] = useState(false);
    const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

    const router = useRouter();

    //form function
    const toggleEdit = () => setIsEditing((current) => !current);

    const onDelete = async (attachmentId: string) => {
        setIsDeletingId(attachmentId);
        const toastId = toast.loading("Deleting attachment...");
        try {
            await axios.delete(
                `/api/courses/${courseId}/attachments/${attachmentId}`
            );
            toast.success("Attachment deleted successfully", { id: toastId });
            router.refresh();
        } catch (error) {
            toast.error("Failed to delete attachment", { id: toastId });
            console.log(error);
        } finally {
            setIsDeletingId(null);
        }
    };

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Attachement Du Cours
                <Button variant="ghost" onClick={toggleEdit}>
                    {isEditing && <span>Annuler</span>}
                    {!isEditing && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Ajouter un fichier
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <>
                    {initialData.attachments.length === 0 && (
                        <p className="text-sm mt-2 text-slate-500 italic">
                            No Attachments yet
                        </p>
                    )}
                    {initialData.attachments.length > 0 && (
                        <div className="space-y-2">
                            {initialData.attachments.map((attachment) => (
                                <div
                                    key={attachment.id}
                                    className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                                >
                                    <File className="h-4 w-4 mr-2 flex-shrink-0" />
                                    <p className="text-xs line-clamp-1">
                                        {attachment.name}
                                    </p>

                                    {isDeletingId === attachment.id && (
                                        <div className="flex-shrink-0 mx-auto transition">
                                            <Loader2 className="h-4 w-4 animate-spin">
                                                Deleting...
                                            </Loader2>
                                        </div>
                                    )}
                                    {isDeletingId !== attachment.id && (
                                        <Button
                                            variant="ghost"
                                            onClick={() => {
                                                onDelete(attachment.id);
                                            }}
                                            className="ml-auto hover:opacity-70 flex-shrink-0 transition"
                                        >
                                            X
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
            {isEditing && (
                <div className="flex flex-col justify-center items-center bg-slate-200 h-60 rounded-md ">
                    <SingleImageDropzone
                        width={100}
                        height={100}
                        value={file}
                        dropzoneOptions={{
                            maxSize: 1024 * 1024 * 2, // 1MB
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
                        <Button
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
                                    setUrl(res.url);
                                    console.log("THE URL............", res.url);
                                    // Appelle directement l'API pour mettre à jour l'imageUrl
                                    try {
                                        await axios.post(
                                            `/api/courses/${courseId}/attachments`,
                                            {
                                                url: url || res.url,
                                            }
                                        );
                                        toast.success(
                                            "Course Attachment updated successfully."
                                        );
                                        toggleEdit();
                                        router.refresh();
                                        setFile(undefined);
                                    } catch (error) {
                                        toast.error(
                                            "Failed to update course Attachment."
                                        );
                                        console.log(error);
                                    }
                                    console.log(url);
                                }
                            }}
                        >
                            Upload Attachment
                        </Button>
                    ) : (
                        <Button>Upload to the Db</Button>
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
