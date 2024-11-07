import DefaultLayout from "../components/layout/DefaultLayout";
import Layout from "../components/layout/Layout";
import CorporateList from "../superadmin/Corporates/CorporateList";
import CreateAdminForm from "../superadmin/CreateAdminForm";
import InstituteList from "../superadmin/Institutes/InstituteList";
import SchoolList from "../superadmin/Schools/SchoolList";
import SuperAdminPage from "../superadmin/SuperAdminPage";
import PageTitle from "../utils/PageTitle";

const superAdminRoutes = [
   
    { 
        path: "/", 
        element: (
            <DefaultLayout>
                <PageTitle title="Create an admin | AlumnLink" />
                <SuperAdminPage />
            </DefaultLayout>
        )
    },
    { 
        path: "/create-admin", 
        element: (
            <DefaultLayout>
                <PageTitle title="Create an admin | AlumnLink" />
             
                <CreateAdminForm />
               
            </DefaultLayout>
        )
    },
    { 
        path: "/Institute-List", 
        element: (
            <DefaultLayout>
                <PageTitle title="Manage Institutes | AlumnLink" />
             
                <InstituteList />
               
            </DefaultLayout>
        )
    },
    { 
        path: "/School-List", 
        element: (
            <DefaultLayout>
                <PageTitle title="Manage Schools | AlumnLink" />
             
                <SchoolList />
               
            </DefaultLayout>
        )
    },
    { 
        path: "/corporate-List", 
        element: (
            <DefaultLayout>
                <PageTitle title="Manage Schools | AlumnLink" />
             
                <CorporateList />
               
            </DefaultLayout>
        )
    },

    // Add additional super-admin-specific routes here if needed
];


export default superAdminRoutes;
