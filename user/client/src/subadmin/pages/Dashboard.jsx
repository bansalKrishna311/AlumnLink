import React from 'react';
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import SubAdminSidebar from '../components/SubAdminSidebar';
import SubAdminDashboardPage from './SubAdminDashboardPage';

const SubAdminDashboard = () => {
  return (
    <SidebarProvider className="w-full h-full flex">
      <div className="flex w-full h-full">
        <SubAdminSidebar />
        <SidebarInset className="flex-1 w-full">
          <header className="flex h-14 items-center px-4">
            <SidebarTrigger className="mr-2" />
          </header>
          <main className="p-4 w-full">
            {/* SubAdmin specific dashboard */}
            <SubAdminDashboardPage />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

export default SubAdminDashboard;
