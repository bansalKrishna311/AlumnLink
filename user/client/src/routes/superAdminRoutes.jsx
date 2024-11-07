import CreateAdminForm from "../superadmin/CreateAdminForm";
import SuperAdminPage from "../superadmin/SuperAdminPage";

const superAdminRoutes = [
    { path: "/", element: <SuperAdminPage /> },
    { path: "/create-admin", element: <CreateAdminForm /> },

    // Add additional super-admin-specific routes here if needed
];


export default superAdminRoutes;
