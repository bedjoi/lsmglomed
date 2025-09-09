"use client";
import dynamic from "next/dynamic";
import React, { useMemo, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

interface PreviewrProps {
    value: string;
}

export const Preview = ({ value }: PreviewrProps) => {
    const ReactQuill = useMemo(
        () => dynamic(() => import("react-quill-new"), { ssr: false }),
        []
    );
    return <ReactQuill theme="bubble" value={value} readOnly />;
};
