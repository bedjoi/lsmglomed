import React from "react";
import Sidebar from "./_components/sidebar";
import Navbar from "./_components/navbar";

const dashboardLayout = ({ children }: {
    children: React.ReactNode
}) => {
    return <div className="h-full">
        <div className="h-[71px] md:pl-56 fixed inset-y-0 w-full z-50">
            <Navbar />
            
                    
                </div>
                <div className="hidden  md:flex w-56 flex-col fixed inset-y-0 z-50 ">
                  <Sidebar />
    
                </div>
                <main className="md:pl-56 pt-[71px] h-full">
    
                  {children}
                </main>
              </div>;
};

export default dashboardLayout;
