
import AdminLayout from "@/components/layout/admin/adminLayout";
import Dashboard from "../admin/Dashboard";
import ManageUsers from "@/admin/ManageUsers";
import AddEvent from "@/admin/AddEvent";
import Layout from "../components/layout/Layout";
import PageTitle from "../utils/PageTitle";
import ManageAlumni from "@/admin/manage-alumni";

const adminRoutes = [
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
                <ManageUsers />
            </AdminLayout>
        )
    },
    { 
        path: "/manage-alumni", 
        element: (
            <AdminLayout>
                <PageTitle title="Manage User | AlumnLink" />
                <ManageAlumni />
            </AdminLayout>
        )
    },
    { 
        path: "/addevent", 
        element: (
            <AdminLayout>
                <PageTitle title="Add Event | AlumnLink" />
                <AddEvent />
            </AdminLayout>
        )
    },
];

export default adminRoutes;
