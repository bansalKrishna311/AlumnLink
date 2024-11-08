
import AdminLayout from "@/components/layout/admin/adminLayout";
import AdminPage from "../admin/AdminPage";
import Layout from "../components/layout/Layout";
import PageTitle from "../utils/PageTitle";

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
];

export default adminRoutes;
