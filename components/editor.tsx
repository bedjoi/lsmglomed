"use client";
import dynamic from "next/dynamic";
import React, { useMemo, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

interface EditorProps {
    value: string;
    onChange: (value: string) => void;
}

export const Editor = ({ onChange, value }: EditorProps) => {
    const ReactQuill = useMemo(
        () => dynamic(() => import("react-quill-new"), { ssr: false }),
        []
    );
    return (
        <div className="w-full bg-white">
            <ReactQuill theme="snow" value={value} onChange={onChange} />
        </div>
    );
};
