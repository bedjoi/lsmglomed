"use client";
import axios from "axios";
import MuxPlayer from "@mux/mux-player-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useConfettiStore } from "@/use-confetti-store";

interface VideoPlayerProps {
    playbackId: string;
    courseId: string;
    chapterId: string;
    nextChapterId: string;
    isLocked: boolean;
    completeOnEnd: boolean;
    title: string;
}

function VideoPlayer({
    chapterId,
    title,
    courseId,
    playbackId,
    nextChapterId,
    isLocked,
    completeOnEnd,
}: VideoPlayerProps) {
    const [isReady, setIsReady] = useState(false);
    const router = useRouter();
    const { startConfetti } = useConfettiStore();
    return (
        <div className="relative aspect-video">
            {!isReady && !isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                    <Loader2 className="h-8 w-8 animate-spin text-secondary" />
                </div>
            )}
            {isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
                    <Lock className="h-8 w-8" />
                    <p className="text-sm">
                        You need to purchase the course to access this video.
                    </p>
                </div>
            )}
            {!isLocked && (
                <MuxPlayer
                    title={title}
                    className={cn(
                        "w-full h-full",
                        !isReady && "hidden",
                        isReady && "visible"
                    )}
                    onCanPlay={() => setIsReady(true)}
                    onEnded={async () => {
                        if (completeOnEnd) {
                            const toastId = toast.loading(
                                "Marking chapter as complete..."
                            );
                            try {
                                await axios.post(
                                    `/api/courses/${courseId}/chapters/${chapterId}/complete`
                                );
                                toast.success("Chapter marked as complete!", {
                                    id: toastId,
                                });
                                if (nextChapterId) {
                                    router.push(
                                        `/courses/${courseId}/chapters/${nextChapterId}`
                                    );
                                }
                                startConfetti();
                            } catch (error) {
                                console.log(error);
                                toast.error("Something went wrong.", {
                                    id: toastId,
                                });
                            }
                        } else {
                            if (nextChapterId) {
                                router.push(
                                    `/courses/${courseId}/chapters/${nextChapterId}`
                                );
                            }
                        }
                    }}
                    playbackId={playbackId}
                    streamType="on-demand"
                    autoPlay
                    muted
                />
            )}
        </div>
    );
}

export default VideoPlayer;
