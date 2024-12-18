import * as React from "react";

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export function VersionSwitcher({ defaultVersion }) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div
            className="flex  size-8 items-center justify-center"
          >
            <img src="/icon.png" alt="icon" className="size-8" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-semibold">Alumnlink</span>
            <span>{defaultVersion}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
