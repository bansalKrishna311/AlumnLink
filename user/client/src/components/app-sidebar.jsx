import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { VersionSwitcher } from "@/components/version-switcher";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { axiosInstance } from "@/lib/axios";

const data = {
  versions: ["Admin"],
  navMain: [
    {
      items: [
        { title: "Dashboard", url: "/" },
        { title: "Manage User Requests", url: "/userrequests" },
        { title: "Manage Alumni", url: "/manage-alumni" },
        { title: "Rejected Requests", url: "/rejected-requests" },
        { title: "Make Post", url: "/post-creation" },
        { title: "Admin Posts", url: "/adminposts" },
        { title: "Post Request", url: "/postrequest" },
      ],
    },
  ],
};

export function AppSidebar({ ...props }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Logout mutation
  const { mutate: logout } = useMutation({
    mutationFn: () => axiosInstance.post("/auth/logout"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] }); // Clear auth data
      navigate("/login", { replace: true }); // Navigate to login page
    },
    onError: (error) => {
      console.error("Logout failed:", error.response?.data?.message || error.message);
    },
  });

  return (
    <Sidebar {...props} className="flex flex-col lg:flex-row">
      <SidebarHeader>
        <VersionSwitcher versions={data.versions} defaultVersion={data.versions[0]} />
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {data.navMain.map((item) => (
          <Collapsible
            key={item.title}
            title={item.title}
            defaultOpen
            className="group/collapsible"
          >
            <SidebarGroup>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {item.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={item.isActive}>
                          <a href={item.url}>{item.title}</a>
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
      <div className="p-4">
        <button
          className="w-full px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
          onClick={() => logout()}
        >
          Logout
        </button>
      </div>
      <SidebarRail />
    </Sidebar>
  );
}
