import * as React from "react";
import { ChevronRight } from "lucide-react";
import { SearchForm } from "@/components/search-form";
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

// Sample data
const data = {
  versions: ["Admin"],
  navMain: [
    {
     
      items: [
        {
          title: "Dashboard",
          url: "/",
        },
        {
          title: "Manage User Requests",
          url: "/userrequests",
        },
        {
          title: "Manage Alumni",
          url: "/manage-alumni",
        },
        {
          title: "Rejected Requests",
          url: "/rejected-requests",
        },
        {
          title: "Make Post",
          url: "/post-creation",
        },
        {
          title: "Admin Posts",
          url: "/adminposts",
        },
        {
          title: "Post Request",
          url: "/postrequest",
        },
      ],
    },
  ],
};

export function AppSidebar({
  ...props
}) {
  return (
    <Sidebar {...props} className="flex flex-col lg:flex-row">
      <SidebarHeader>
        <VersionSwitcher versions={data.versions} defaultVersion={data.versions[0]} />
        {/* <SearchForm /> */}
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {/* Responsive collapsing SidebarGroup for each parent */}
        {data.navMain.map((item) => (
          <Collapsible
            key={item.title}
            title={item.title}
            defaultOpen
            className="group/collapsible">
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
      <SidebarRail />
    </Sidebar>
  );
}
