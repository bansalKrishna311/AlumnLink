import HomePage from "../pages/HomePage";
import NotificationsPage from "../pages/NotificationsPage";
import NetworkPage from "../pages/NetworkPage";
import PostPage from "../pages/PostPage";
import ProfilePage from "../pages/ProfilePage";
import PageTitle from "../utils/PageTitle";
import { Layout } from "lucide-react";

const userRoutes = [
    { 
        path: "/", 
        element: (
            <Layout>
                <PageTitle title="Home | Dr.Kawatra" />
                <HomePage />
            </Layout>
        )
    },
    { 
        path: "/notifications", 
        element: (
            <Layout>
                <PageTitle title="Notifications | Dr.Kawatra" />
                <NotificationsPage />
            </Layout>
        )
    },
    { 
        path: "/network", 
        element: (
            <Layout>
                <PageTitle title="Network | Dr.Kawatra" />
                <NetworkPage />
            </Layout>
        )
    },
    { 
        path: "/post/:postId", 
        element: (
            <Layout>
                <PageTitle title="Post | Dr.Kawatra" />
                <PostPage />
            </Layout>
        )
    },
    { 
        path: "/profile/:username", 
        element: (
            <Layout>
                <PageTitle title="Profile | Dr.Kawatra" />
                <ProfilePage />
            </Layout>
        )
    },
];

export default userRoutes;
