import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
const f = createUploadthing();

const handlAuth = () => {
    const  userId  = auth();
    if (!userId) throw new Error("unauthorized")
    return {userId}
}

// T

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    courseImage: f({
        image:{maxFileSize:"4MB",maxFileCount:1}
    })
        .middleware(() => handlAuth())
        .onUploadComplete(() => { }),
    courseAtachement: f([ "text", "image", "video", "pdf" ])
        .middleware(() => handlAuth())
        .onUploadComplete(() => { }),
    chapterVideo: f({ video:{ maxFileCount: 1, maxFileSize: "512GB" }})
        .middleware(() => handlAuth())
        .onUploadComplete(() =>{})
    
} satisfies FileRouter;
export type OurFileRouter = typeof ourFileRouter;