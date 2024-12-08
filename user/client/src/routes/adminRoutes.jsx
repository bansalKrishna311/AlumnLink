
import AdminLayout from "@/components/layout/admin/adminLayout";
import AdminPage from "../admin/AdminPage";
import Layout from "../components/layout/Layout";
import PageTitle from "../utils/PageTitle";
import PendingRequests from "@/admin/requests";

const adminRoutes = [
    { 
        path: "/", 
        element: (
            <AdminLayout>
                <PageTitle title="Admin Home | AlumnLink" />
                <AdminPage />
            </AdminLayout>
        )
    },
    { 
        path: "/requests", 
        element: (
            <AdminLayout>
                <PageTitle title="Admin Home | AlumnLink" />
                <PendingRequests />
            </AdminLayout>
        )
    },
];

export default adminRoutes;
