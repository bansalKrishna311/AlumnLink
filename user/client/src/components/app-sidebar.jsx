"use client"

import * as React from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { BarChart3, FileText, Home, LogOut, MessageSquare, PlusCircle, ThumbsDown, User, Users, TrendingUp } from "lucide-react"

import { VersionSwitcher } from "@/components/version-switcher"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
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
import { Button } from "@/components/ui/button"
import { axiosInstance } from "@/lib/axios"

export function AppSidebar({ ...props }) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Fetch the authenticated user data
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
  })

  const username = authUser?.username || "" // Fallback to empty string if not logged in

  // Navigation items with icons
  const navItems = [
    { title: "Dashboard", url: "/", icon: Home },
    { title: "Manage User Requests", url: "/userrequests", icon: Users },
    { title: "Manage Alumni", url: "/manage-alumni", icon: User },
    { title: "Rejected Requests", url: "/rejected-requests", icon: ThumbsDown },
    { title: "Make Post", url: "/post-creation", icon: PlusCircle },
    { title: "Admin Posts", url: "/adminposts", icon: FileText },
    { title: "Post Request", url: "/postrequest", icon: MessageSquare },
    { title: "Build Admin Profile", url: `/buildprofile/${username}`, icon: User },
  ]

  const data = {
    versions: ["Admin"],
    navMain: [
      {
        items: navItems,
      },
    ],
  }

  // Determine active item based on current path
  const [activeItem, setActiveItem] = React.useState("")

  React.useEffect(() => {
    // Set active item based on current path
    const path = window.location.pathname
    const currentItem = navItems.find((item) => path === item.url || (item.url !== "/" && path.startsWith(item.url)))

    if (currentItem) {
      setActiveItem(currentItem.title)
    } else {
      setActiveItem("")
    }
  }, [])

  // Logout mutation
  const { mutate: logout } = useMutation({
    mutationFn: () => axiosInstance.post("/auth/logout"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] }) // Clear auth data
      navigate("/login", { replace: true }) // Navigate to login page
    },
    onError: (error) => {
      console.error("Logout failed:", error.response?.data?.message || error.message)
    },
  })

  return (
    <Sidebar {...props} className="border-r border-border">
      <SidebarHeader className="py-4">
        <VersionSwitcher versions={data.versions} defaultVersion={data.versions[0]} className="w-full" />
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
                          onClick={() => setActiveItem(item.title)}
                          className={activeItem === item.title ? "bg-[#fe6019]/20 text-[#fe6019] font-medium" : "hover:bg-[#fe6019]/10 hover:text-[#fe6019]"}
                        >
                          <a href={item.url} className="flex items-center">
                            {item.icon && <item.icon className={`w-4 h-4 mr-2 ${activeItem === item.title ? "text-[#fe6019]" : ""}`} />}
                            <span>{item.title}</span>
                          </a>
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
            <p className="text-sm font-medium text-[#fe6019]">{username || "Admin User"}</p>
            <p className="text-xs text-muted-foreground">Administrator</p>
          </div>
        </div>

        <Button variant="destructive" className="w-full justify-start" onClick={() => logout()}>
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}

