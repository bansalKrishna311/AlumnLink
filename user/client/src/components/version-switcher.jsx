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
          className="data-[state=open]:bg-[#fe6019]/10 data-[state=open]:text-[#fe6019]"
        >
          <div
            className="flex size-8 items-center justify-center border border-[#fe6019]/30 rounded-md"
          >
            <img src="/icon.png" alt="icon" className="size-8" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-semibold text-[#fe6019]">Alumnlink</span>
            <span className="text-[#fe6019]/80">{defaultVersion}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
