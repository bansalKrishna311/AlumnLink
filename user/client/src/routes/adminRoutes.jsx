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
];

