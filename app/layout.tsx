import type { Metadata } from "next";
import {
    ClerkProvider,
    // SignInButton,
    // SignUpButton,
    // SignedIn,
    // SignedOut,
    // UserButton,
} from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ToasterProvider from "@/components/providers/toaster-provider";
import { EdgeStoreProvider } from "@/lib/edgestore";
import ConfettiProvider from "@/components/providers/confetti-provider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Glomed Academia",
    description: "Platform de formation enligne",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body
                    className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                >
                    <ConfettiProvider />
                    <ToasterProvider />
                    <EdgeStoreProvider>{children}</EdgeStoreProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
