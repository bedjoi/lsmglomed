import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            new URL("https://files.edgestore.dev/o2evief3wpfgkcwb/**"),
        ],
    },
    allowedDevOrigins: ["local-origin.dev", "26c1c7eece35.ngrok-free.app"],

    /* config options here */
};

export default nextConfig;
