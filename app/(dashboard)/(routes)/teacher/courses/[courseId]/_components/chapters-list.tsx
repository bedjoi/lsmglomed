"use client";

import { Chapter } from "@prisma/client";
import { useEffect, useState } from "react";
import {
    DragDropContext,
    Draggable,
    Droppable,
    DropResult,
} from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { Grip, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ChapterListProps {
    items: Chapter[];
    onEdit: (id: string) => void;
    onReorder: (updateData: { id: string; position: number }[]) => void;
}

export const ChapterList = ({ items, onEdit, onReorder }: ChapterListProps) => {
    const [isMounted, setIsMounted] = useState(false);
    const [chapters, setChapters] = useState(items);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        setChapters(items);
    }, [items]);

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) {
            return;
        }
        const updatedChapters = Array.from(chapters);
        const [movedChapter] = updatedChapters.splice(result.source.index, 1);
        updatedChapters.splice(result.destination.index, 0, movedChapter);

        setChapters(updatedChapters);

        // Prepare the data to be sent to the server
        const updateData = updatedChapters.map((chapter, index) => ({
            id: chapter.id,
            position: index + 1, // Assuming position starts from 1
        }));

        // Call the onReorder prop to notify parent component
        onReorder(updateData);
    };

    if (!isMounted) {
        return null;
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="chapters">
                {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                        {chapters.map((chapter, index) => (
                            <Draggable
                                key={chapter.id}
                                draggableId={chapter.id}
                                index={index}
                            >
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        // {...provided.dragHandleProps}
                                        className={cn(
                                            "flex items-center gap-x-2 bg-slate-200 border-slate-200 text-slate-700 rounded-sm mb-4 text-sm ",
                                            chapter.isPublished &&
                                                "bg-sky-100 border-sky-200 text-sky-700"
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
                                                chapter.isPublished &&
                                                    "border-r-sky-200 hover:bg-sky-200"
                                            )}
                                            {...provided.dragHandleProps}
                                        >
                                            <Grip className="h-5 w-5" />
                                        </div>
                                        {chapter.title}
                                        <div className="ml-auto pr-2 flex items-center gap-x-2">
                                            {chapter.isFree && (
                                                <Badge className="text-xs">
                                                    Free
                                                </Badge>
                                            )}
                                            <Badge
                                                className={cn(
                                                    "bg-slate-500",
                                                    chapter.isPublished &&
                                                        "bg-sky-500"
                                                )}
                                            >
                                                {chapter.isPublished
                                                    ? "Published"
                                                    : "Draft"}
                                            </Badge>
                                            <Pencil
                                                onClick={() =>
                                                    onEdit(chapter.id)
                                                }
                                                className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
                                            />
                                        </div>
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};
