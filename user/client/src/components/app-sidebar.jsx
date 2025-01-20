import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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



export function AppSidebar({ ...props }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

// Fetch the authenticated user data
const { data: authUser } = useQuery({
  queryKey: ["authUser"],
});

const username = authUser?.username || ""; // Fallback to empty string if not logged in

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
        { title: "Build Admin Profile", url: `/buildprofile/${username}` },
      ],
    },
  ],
};
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
      {data.navMain.map((navGroup, groupIndex) => (
  <Collapsible
    key={`nav-group-${groupIndex}`} // Ensure unique key
    title={navGroup.title}
    defaultOpen
    className="group/collapsible"
  >
    <SidebarGroup>
      <CollapsibleContent>
        <SidebarGroupContent>
          <SidebarMenu>
            {navGroup.items.map((item, itemIndex) => (
              <SidebarMenuItem key={`menu-item-${groupIndex}-${itemIndex}`}>
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
