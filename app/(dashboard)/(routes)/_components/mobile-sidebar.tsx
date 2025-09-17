import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import React from "react";
import Sidebar from "./sidebar";
import { VisuallyHidden } from "@/components/ui/visually-hidden";

const MobileSidebar = () => {
    return (
        <div>
            <Sheet>
                <SheetTrigger className="md:hidden fixed pr-4 hover:opacity-75 transition-opacity z-50">
                    <Menu />
                </SheetTrigger>
                <SheetContent side="left" className="bg-white">
                    <VisuallyHidden>
                        <SheetTitle>Navigation Menu</SheetTitle>
                    </VisuallyHidden>
                    <Sidebar />
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default MobileSidebar;
