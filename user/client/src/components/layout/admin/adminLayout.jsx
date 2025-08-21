import { Suspense } from "react"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Loader2 } from "lucide-react"
import "@/styles/smart-table.css"

export default function adminLayout({ children }) {
  return (
    <SidebarProvider className="w-full h-full flex">
      <div className="flex w-full h-full">
        <AppSidebar />
        <SidebarInset className="flex-1 w-full">
          <header className="flex h-14 items-center px-4 bg-white border-b border-gray-200">
            <SidebarTrigger className="mr-2" />
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-semibold text-gray-900">Admin Panel</h1>
            </div>
          </header>
          <main className="p-4 w-full overflow-auto bg-gray-50 min-h-[calc(100vh-3.5rem)]">
            <Suspense 
              fallback={
                <div className="flex items-center justify-center h-64">
                  <div className="flex flex-col items-center space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin text-[#fe6019]" />
                    <p className="text-sm text-gray-600">Loading...</p>
                  </div>
                </div>
              }
            >
              <div className="transition-all duration-200 ease-in-out admin-content">
                {children}
              </div>
            </Suspense>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

