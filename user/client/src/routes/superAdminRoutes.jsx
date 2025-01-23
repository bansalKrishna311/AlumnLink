import DefaultLayout from "../components/layout/DefaultLayout";
import Layout from "../components/layout/Layout";
import CorporateList from "../superadmin/Corporates/CorporateList";
import CreateAdminForm from "../superadmin/CreateAdminForm";
import InstituteList from "../superadmin/Institutes/InstituteList";
import SchoolList from "../superadmin/Schools/SchoolList";
import SuperAdminPage from "../superadmin/SuperAdminPage";
import InstituteAnalysis from "../superadmin/InstituteAnalysis";
import PageTitle from "../utils/PageTitle";

export const superAdminRoutes = [
   
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
        path: "/institute-analysis", 
        element: (
            <DefaultLayout>
                <PageTitle title="Create an admin | AlumnLink" />
                <InstituteAnalysis />
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



