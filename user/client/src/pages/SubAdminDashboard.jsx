import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useLocation } from "react-router-dom"
import { axiosInstance } from '@/lib/axios';
import AdminPage from '@/admin/Dashboard';
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { 
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { 
  Home,
  UserCheck,
  Users,
  UserX,
  FileText,
  MessageSquare,
  User
} from 'lucide-react';

const SubAdminDashboard = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // Get current user data
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    queryFn: () => axiosInstance.get("/auth/me").then((res) => res.data),
  });

  // Sub-Admin specific navigation items
  const navItems = React.useMemo(() => [
    { title: "Dashboard", url: "/subadmin", icon: Home },
    { title: "Manage User Requests", url: "/userrequests", icon: UserCheck },
    { title: "Manage Alumni", url: "/manage-alumni", icon: Users },
    { title: "Rejected Requests", url: "/rejected-requests", icon: UserX },
    { title: "Make Post", url: "/post-creation", icon: FileText },
    { title: "Sub-Admin Posts", url: "/adminposts", icon: MessageSquare },
    { title: "Rejected Posts", url: "/rejected-posts", icon: UserX },
    { title: "Post Request", url: "/postrequest", icon: MessageSquare },
  ], [])

  const data = {
    versions: ["Sub-Admin"],
    navMain: [
      {
        items: navItems,
      },
    ],
  }

  // Determine active item based on current path
  const [activeItem, setActiveItem] = React.useState("")

  React.useEffect(() => {
    const path = location.pathname
    const currentItem = navItems.find((item) => path === item.url || (item.url !== "/subadmin" && path.startsWith(item.url)))

    if (currentItem) {
      setActiveItem(currentItem.title)
    } else if (path === "/subadmin") {
      setActiveItem("Dashboard")
    } else {
      setActiveItem("")
    }
  }, [location.pathname, navItems])

  // Navigate to home function
  const goToHome = () => {
    navigate("/")
  }

  const formatHierarchyName = (hierarchy) => {
    if (!hierarchy) return 'Alumni';
    return hierarchy.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const SubAdminSidebar = ({ ...props }) => (
    <Sidebar {...props} className="border-r border-border">
      <SidebarHeader className="py-4">
        <div className="flex items-center space-x-3 px-4">
          <div className="w-8 h-8 bg-[#fe6019] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <div>
            <div className="font-semibold text-[#fe6019]">AlumnLink</div>
            <div className="text-xs text-muted-foreground">Sub-Admin</div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        {data.navMain.map((navGroup, groupIndex) => (
          <Collapsible key={`nav-group-${groupIndex}`} defaultOpen className="group/collapsible">
            <SidebarGroup>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {navGroup.items.map((item, itemIndex) => (
                      <SidebarMenuItem key={`menu-item-${groupIndex}-${itemIndex}`}>
                        <SidebarMenuButton
                          asChild
                          isActive={activeItem === item.title}
                          onClick={() => {
                            setActiveItem(item.title)
                            navigate(item.url)
                          }}
                          className={activeItem === item.title ? "bg-[#fe6019]/20 text-[#fe6019] font-medium" : "hover:bg-[#fe6019]/10 hover:text-[#fe6019]"}
                        >
                          <div className="flex items-center cursor-pointer w-full">
                            {item.icon && <item.icon className={`w-4 h-4 mr-2 ${activeItem === item.title ? "text-[#fe6019]" : ""}`} />}
                            <span>{item.title}</span>
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>

      <SidebarFooter className="mt-auto border-t border-border p-4">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 rounded-full bg-[#fe6019]/20 flex items-center justify-center">
            <User className="w-4 h-4 text-[#fe6019]" />
          </div>
          <div className="ml-2">
            <p className="text-sm font-medium text-[#fe6019]">{authUser?.name || "Sub-Admin"}</p>
            <p className="text-xs text-muted-foreground">{formatHierarchyName(authUser?.adminHierarchy || 'administrator')}</p>
          </div>
        </div>

        <Button variant="outline" className="w-full justify-start" onClick={() => goToHome()}>
          <Home className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )

  return (
    <SidebarProvider className="w-full h-full flex">
      <div className="flex w-full h-full">
        <SubAdminSidebar />
        <SidebarInset className="flex-1 w-full">
          <header className="flex h-14 items-center px-4">
            <SidebarTrigger className="mr-2" />
          </header>
          <main className="p-4 w-full">
            {/* Reuse the exact AdminPage component but with Sub-Admin context */}
            <AdminPage />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

export default SubAdminDashboard;

