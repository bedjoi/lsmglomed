"use client";

import { type EdgeStoreRouter } from "@/app/api/edgestore/[..edgestore]/store";
import { createEdgeStoreProvider } from "@edgestore/react";

export const { EdgeStoreProvider, useEdgeStore } =
    createEdgeStoreProvider<EdgeStoreRouter>({
        maxConcurrentUploads: 1,
    });
