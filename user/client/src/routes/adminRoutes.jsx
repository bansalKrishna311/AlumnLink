
import AdminLayout from "@/components/layout/admin/adminLayout";
import Dashboard from "../admin/Dashboard";
import ManageUsers from "@/admin/ManageUsers";
import AddEvent from "@/admin/AddEvent";
import Layout from "../components/layout/Layout";
import PageTitle from "../utils/PageTitle";

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
        path: "/manageuser", 
        element: (
            <AdminLayout>
                <PageTitle title="Manage User | AlumnLink" />
                <ManageUsers />
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
