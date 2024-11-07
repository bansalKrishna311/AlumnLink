
import AdminPage from "../admin/AdminPage";
import Layout from "../components/layout/Layout";
import PageTitle from "../utils/PageTitle";

const adminRoutes = [
    { 
        path: "/", 
        element: (
            <Layout>
                <PageTitle title="Admin Home | AlumnLink" />
                <AdminPage />
            </Layout>
        )
    },
];

export default adminRoutes;
