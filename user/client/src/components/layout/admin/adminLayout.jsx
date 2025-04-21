import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function adminLayout({ children }) {
  return (
    <SidebarProvider className="w-full h-full flex">
      <div className="flex w-full h-full">
        <AppSidebar />
        <SidebarInset className="flex-1 w-full">
          <header className="flex h-14 items-center  px-4">
            <SidebarTrigger className="mr-2" />
          </header>
          <main className="p-4 w-full">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

