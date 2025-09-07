import React from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { useSubAdmin } from '../context/SubAdminContext';
import { getHierarchyDisplayName } from '../utils/accessControl';
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
  Users,
  UserX,
  User,
  GraduationCap,
  PlusCircle,
  MessageSquare,
  FileX,
  FileText
} from 'lucide-react';

const SubAdminSidebar = ({ ...props }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { targetAdminId } = useSubAdmin();

  // Get current user data
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    queryFn: () => axiosInstance.get("/auth/me").then((res) => res.data),
  });

  // Get user hierarchy from the new dedicated endpoint
  const { data: hierarchyData, error: hierarchyError } = useQuery({
    queryKey: ["currentUserHierarchy"],
    queryFn: () => axiosInstance.get('/links/hierarchy/my-hierarchy').then((res) => res.data),
    enabled: !!authUser?._id,
    retry: false,
  });

  // Get target admin info if managing another admin
  const { data: targetAdminInfo } = useQuery({
    queryKey: ["targetAdminInfo", targetAdminId],
    queryFn: () => axiosInstance.get(`/users/${targetAdminId}`).then((res) => res.data),
    enabled: !!targetAdminId && targetAdminId !== authUser?._id,
    retry: false,
  });

  // Debug log for user hierarchy
  React.useEffect(() => {
    if (authUser) {
      console.log('SubAdminSidebar - User data:', {
        name: authUser.name,
        userId: authUser._id,
        targetAdminId: targetAdminId,
        targetAdminInfo: targetAdminInfo,
        isManagingAnotherAdmin: !!targetAdminId && targetAdminId !== authUser._id,
        authUserAdminHierarchy: authUser.adminHierarchy,
        hierarchyData: hierarchyData,
        hierarchyFromAPI: hierarchyData?.adminHierarchy,
        hierarchySource: hierarchyData?.source,
        hierarchyError: hierarchyError?.response?.data || hierarchyError?.message,
        role: authUser.role,
        isAdmin: authUser.isAdmin,
        finalHierarchy: hierarchyData?.adminHierarchy || authUser?.adminHierarchy
      });
      
      // Log the actual values being used for hierarchy detection
      const actualHierarchy = hierarchyData?.adminHierarchy || authUser?.adminHierarchy;
      console.log('Actual hierarchy being used:', actualHierarchy);
      console.log('Hierarchy API response:', hierarchyData);
    }
  }, [authUser, hierarchyData, hierarchyError, targetAdminId, targetAdminInfo]);

  // Get accessible navigation items based on user hierarchy
  const navItems = React.useMemo(() => {
    // Build query string with adminId if available
    const queryParams = new URLSearchParams();
    if (targetAdminId) {
      queryParams.append('adminId', targetAdminId);
    }
    const queryString = queryParams.toString();
    const urlSuffix = queryString ? `?${queryString}` : '';

    // Show all functional navigation items
    return [
      { title: "Dashboard", url: `/subadmin/dashboard${urlSuffix}`, icon: "Home" },
      { title: "View Posts", url: `/subadmin/posts${urlSuffix}`, icon: "FileText" },
      { title: "Manage User Requests", url: `/subadmin/network-requests${urlSuffix}`, icon: "Users" },
      { title: "Manage Alumni", url: `/subadmin/manage-alumni${urlSuffix}`, icon: "GraduationCap" },
      { title: "Create Post", url: `/subadmin/post-creation${urlSuffix}`, icon: "PlusCircle" },
      { title: "Post Requests", url: `/subadmin/post-requests${urlSuffix}`, icon: "MessageSquare" },
      { title: "Rejected Posts", url: `/subadmin/rejected-posts${urlSuffix}`, icon: "FileX" },
      { title: "Rejected Requests", url: `/subadmin/rejected-requests${urlSuffix}`, icon: "UserX" },
    ];
  }, [targetAdminId]);

  // Icon mapping
  const iconMap = {
    Home,
    Users,
    UserX,
    GraduationCap,
    PlusCircle,
    MessageSquare,
    FileX,
    FileText
  };

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
    const currentItem = navItems.find((item) => path === item.url || (item.url !== "/subadmin/dashboard" && path.startsWith(item.url)))

    if (currentItem) {
      setActiveItem(currentItem.title)
    } else if (path === "/subadmin" || path === "/subadmin/dashboard") {
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
    return getHierarchyDisplayName(hierarchy);
  };

  // Get hierarchy from new API endpoint
  const userHierarchy = hierarchyData?.adminHierarchy || authUser?.adminHierarchy || 'hod'; // Temporary fallback to 'hod' for testing

  return (
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
                    {navGroup.items.map((item, itemIndex) => {
                      const IconComponent = iconMap[item.icon] || Home;
                      return (
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
                              <IconComponent className={`w-4 h-4 mr-2 ${activeItem === item.title ? "text-[#fe6019]" : ""}`} />
                              <span>{item.title}</span>
                            </div>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
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
            <p className="text-xs text-muted-foreground">{formatHierarchyName(userHierarchy || 'alumni')}</p>
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
}

export default SubAdminSidebar;
