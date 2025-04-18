import { Search } from "lucide-react"

import { Label } from "@/components/ui/label"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarInput,
} from "@/components/ui/sidebar"

export function SearchForm({
  ...props
}) {
  return (
    (<form {...props}>
      <SidebarGroup className="py-0">
        <SidebarGroupContent className="relative">
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>
          <SidebarInput 
            id="search" 
            placeholder="Search the docs..." 
            className="pl-8 focus-visible:ring-[#fe6019] focus-visible:border-[#fe6019]" 
          />
          <Search
            className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none text-[#fe6019]/70" />
        </SidebarGroupContent>
      </SidebarGroup>
    </form>)
  );
}
