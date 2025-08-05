import React from "react";
import Sidebar from "./_components/sidebar";

const dashboardLayout = ({ children }: {
    children: React.ReactNode
}) => {
    return <div className="h-full hidden md:flex w-56 flex-col fixed inset-y-0 z-50 ">  <div className="h-full">
                <div className="hidden md:flex h-full w-56 flex-col  inset-y-0 z-50">
                  <Sidebar />
    
                </div>
                <main>
    
                  {children}
                </main>
              </div></div>;
};

export default dashboardLayout;
