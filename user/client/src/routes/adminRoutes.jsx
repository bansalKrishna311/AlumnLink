import AdminLayout from "@/components/layout/admin/adminLayout";
import Dashboard from "../admin/Dashboard";
import PageTitle from "../utils/PageTitle";
import PostCreationPage from "@/admin/PostCreationPage";
import AdminPosts from "@/admin/AdminPosts";
import LinkRequestsTable from "@/admin/ManageUsers";
import UserLinks from "@/admin/manage-alumni";
import RejectedRequests from "@/admin/rejectedRequests";
import RejectedPosts from "@/admin/RejectedPosts";
import PostRequest from "@/admin/PostRequest";
import ProfileBuild from "@/pages/ProfileBuild";
import UserLinksPage from "@/components/UserLinksModal";
import UserPostsPage from "@/pages/UserPostsPage";
import ProfilePage from "@/pages/ProfilePage";
import adminLayout from './../components/layout/admin/adminLayout';
import SavedPostsPage from "@/pages/SavedPostsPage";
import MemberList from "@/components/MemberList";

export const adminRoutes = [
    { 
        path: "/dashboard", 
        element: (
            <AdminLayout>
                <PageTitle title="Dashboard | AlumnLink" />
                <Dashboard />
            </AdminLayout>
        )
    },
    { 
        path: "/", 
        element: (
            <AdminLayout>
                <PageTitle title="Dashboard | AlumnLink" />
                <Dashboard />
            </AdminLayout>
        )
    },
    { 
        path: "/userrequests", 
        element: (
            <AdminLayout>
                <PageTitle title="Manage User | AlumnLink" />
                <LinkRequestsTable />
            </AdminLayout>
        )
    },
    { 
        path: "/network-members", 
        element: (
            <AdminLayout>
                <PageTitle title="Network Members | AlumnLink" />
                <MemberList />
            </AdminLayout>
        )
    },
    { 
        path: "/post-creation", 
        element: (
            <AdminLayout>
                <PageTitle title="Manage User | AlumnLink" />
                <PostCreationPage />
            </AdminLayout>
        )
    },
    { 
        path: "/manage-alumni", 
        element: (
            <AdminLayout>
                <PageTitle title="Manage User | AlumnLink" />
                <UserLinks />
            </AdminLayout>
        )
    },
    { 
        path: "/rejected-requests", 
        element: (
            <AdminLayout>
                <PageTitle title="Manage User | AlumnLink" />
                <RejectedRequests />
            </AdminLayout>
        )
    },
    { 
        path: "/rejected-posts", 
        element: (
            <AdminLayout>
                <PageTitle title="Rejected Posts | AlumnLink" />
                <RejectedPosts />
            </AdminLayout>
        )
    },
    { 
        path: "/adminposts", 
        element: (
            <AdminLayout>
                <PageTitle title="Admin Posts | AlumnLink" />
                <AdminPosts />
            </AdminLayout>
        )
    },
    { 
        path: "/postrequest", 
        element: (
            <AdminLayout>
                <PageTitle title="Admin Request | AlumnLink" />
                <PostRequest />
            </AdminLayout>
        )
    },
    { 
        path: "/buildprofile/:username", 
        element: (
            <AdminLayout>
                <PageTitle title="Admin Profile | AlumnLink" />
                <ProfileBuild />
            </AdminLayout>
        )
    },
    {
        path: "/links/:userId",
        element: (
        
                <AdminLayout>
                    <PageTitle title="UserLinks | AlumnLink" />
                    <UserLinksPage/>
                </AdminLayout>
        ),},
        {
            path: "/profile/:username",
            element: (
                
                    <AdminLayout>
                        <PageTitle title="Profile | AlumnLink" />
                        <ProfilePage />
                    </AdminLayout>
               
            ),
        },
        {
            path: "/profile/:username/posts",
            element: (
                
                    <AdminLayout>
                        <PageTitle title="Profile | AlumnLink" />
                        <UserPostsPage />
                    </AdminLayout>
          
            ),
        },
        {
            path: "/saved-posts",
            element: (
                <AdminLayout>
                    <PageTitle title="Saved Posts | AlumnLink" />
                    <div className="p-6">
                        <SavedPostsPage />
                    </div>
                </AdminLayout>
            ),
        },
];

