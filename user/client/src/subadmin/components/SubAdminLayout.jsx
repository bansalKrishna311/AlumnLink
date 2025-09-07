import React from 'react';
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import SubAdminSidebar from './SubAdminSidebar';
import { SubAdminProvider } from '../context/SubAdminContext';

const SubAdminLayout = ({ children }) => {
  return (
    <SubAdminProvider>
      <SidebarProvider className="w-full h-screen flex">
        <div className="flex w-full h-full">
          <SubAdminSidebar />
          <SidebarInset className="flex-1 w-full overflow-auto">
            <header className="sticky top-0 z-10 flex h-14 items-center px-4 bg-white border-b border-gray-200">
              <SidebarTrigger className="mr-2" />
            </header>
            <main className="p-4 w-full min-h-[calc(100vh-3.5rem)]">
              {children}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </SubAdminProvider>
  )
}

export default SubAdminLayout;
