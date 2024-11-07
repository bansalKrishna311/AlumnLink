import Layout from "../components/layout/Layout";
import CreateAdminForm from "../superadmin/CreateAdminForm";
import SuperAdminPage from "../superadmin/SuperAdminPage";
import PageTitle from "../utils/PageTitle";

const superAdminRoutes = [
   
    { 
        path: "/", 
        element: (
            <Layout>
                <PageTitle title="Create an admin | AlumnLink" />
                <SuperAdminPage />
            </Layout>
        )
    },
    { 
        path: "/create-admin", 
        element: (
            <Layout>
                <PageTitle title="Create an admin | AlumnLink" />
                <CreateAdminForm />
            </Layout>
        )
    },

    // Add additional super-admin-specific routes here if needed
];


export default superAdminRoutes;
