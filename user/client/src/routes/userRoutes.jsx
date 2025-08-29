import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast"; // Assuming react-hot-toast is installed
import { axiosInstance } from "@/lib/axios";
import Layout from "../components/layout/Layout";
import PageTitle from "../utils/PageTitle";
import HomePage from "../pages/HomePage";
import NotificationsPage from "../pages/NotificationsPage";
import NetworkPage from "../pages/NetworkPage";
import PostPage from "../pages/PostPage";
import ProfilePage from "../pages/ProfilePage";
import MyLinksPage from "../pages/MyLinksPage";
import HashtagPage from "../pages/HashtagPage";
import UserLinksPage from "@/components/UserLinksModal";
import JoinNetworkCalling from "@/pages/JoinNetworkCalling";
import ComingSoon from "@/pages/ComingSoon";
import SavedPostsPage from "@/pages/SavedPostsPage";
import UserPostsPage from "@/pages/UserPostsPage";
import ConversationsPage from "@/pages/ConversationsPage";
import ChatPage from "@/pages/ChatPage";
import UserDashboard from "@/components/UserDashboard";
import MemberList from "@/components/MemberList";
import NetworkActions from "@/components/NetworkActions";
import AccessControl from "@/components/AccessControl";
import UserLayout from "@/components/layout/user/UserLayout";
import ContentModeration from "@/components/ContentModeration";
import UserManagement from "@/components/UserManagement";
import NetworkSettings from "@/components/NetworkSettings";
import AdminPanel from "@/components/AdminPanel";
import SystemControl from "@/components/SystemControl";

const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axiosInstance.get("/auth/me");
                const user = response.data;

                if (user.Links.length === 0) {
                    toast.error("Join a network first to get started with your home page!");
                    // Wrap navigate in setTimeout to ensure it gets executed correctly
                    setTimeout(() => navigate("/network"), 0);
                }
            } catch (error) {
                console.error("Failed to fetch user data:", error);
                // Redirect to homepage on error
                setTimeout(() => navigate("/"), 0);
            }
        };

        fetchUser();
    }, [navigate]);

    return children;
};

 export const userRoutes = [
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <Layout>
                    <PageTitle title="Home | AlumnLink" />
                    <HomePage />
                </Layout>
            </ProtectedRoute>
        ),
    },
    {
        path: "/notifications",
        element: (
            <ProtectedRoute>
                <Layout>
                    <PageTitle title="Notifications | AlumnLink" />
                    <NotificationsPage />
                </Layout>
            </ProtectedRoute>
        ),
    },
    {
        path: "/network",
        element: (
            <Layout>
                <PageTitle title="Network | AlumnLink" />
                <JoinNetworkCalling /> 
            </Layout>
        ),
    },
    {
        path: "/post/:postId",
        element: (
            <ProtectedRoute>
                <Layout>
                    <PageTitle title="Post | AlumnLink" />
                    <PostPage />
                </Layout>
            </ProtectedRoute>
        ),
    },
    {
        path: "/profile/:username",
        element: (
            <ProtectedRoute>
                <Layout>
                    <PageTitle title="Profile | AlumnLink" />
                    <ProfilePage />
                </Layout>
            </ProtectedRoute>
        ),
    },
    {
        path: "/profile/:username/posts",
        element: (
            <ProtectedRoute>
                <Layout>
                    <PageTitle title="Profile | AlumnLink" />
                    <UserPostsPage />
                </Layout>
            </ProtectedRoute>
        ),
    },
    {
        path: "/my-links",
        element: (
            <ProtectedRoute>
                <PageTitle title="My Links | AlumnLink" />
                <MyLinksPage />
            </ProtectedRoute>
        ),
    },
    {
        path: "/links/:userId",
        element: (
            <ProtectedRoute>
                <Layout>
                    <PageTitle title="UserLinks | AlumnLink" />
                    <UserLinksPage/>
                </Layout>
            </ProtectedRoute>
        ),
    },
    {
        path: "/comingsoon",
        element: (
            <ProtectedRoute>
                <Layout>
                    <PageTitle title="Coming Soon | AlumnLink" />
                    <ComingSoon/>
                </Layout>
            </ProtectedRoute>

        ),
    },
    {
        path: "/saved-posts",
        element: (
            <ProtectedRoute>
                <Layout>
                    <PageTitle title="Saved Posts | AlumnLink" />
                    <SavedPostsPage />
                </Layout>
            </ProtectedRoute>
        ),
    },
    {
        path: "/hashtag/:tag",
        element: (
            <ProtectedRoute>
                <Layout>
                    <PageTitle title="Hashtag | AlumnLink" />
                    <HashtagPage />
                </Layout>
            </ProtectedRoute>
        ),
    },
    {
        path: "/messages",
        element: (
            <ProtectedRoute>
                <Layout>
                    <PageTitle title="Messages | AlumnLink" />
                    <ConversationsPage />
                </Layout>
            </ProtectedRoute>
        ),
    },
    {
        path: "/messages/:username",
        element: (
            <ProtectedRoute>
                <Layout>
                    <PageTitle title="Chat | AlumnLink" />
                    <ChatPage />
                </Layout>
            </ProtectedRoute>
        ),
    },
    // NEW ACCESS LEVEL FEATURES - ADDED ALONGSIDE EXISTING ROUTES
    {
        path: "/access-dashboard",
        element: (
            <ProtectedRoute>
                <UserLayout>
                    <PageTitle title="Access Level Dashboard | AlumnLink" />
                    <UserDashboard />
                </UserLayout>
            </ProtectedRoute>
        ),
    },
    {
        path: "/access/network-members",
        element: (
            <ProtectedRoute>
                <UserLayout>
                    <PageTitle title="Network Members | AlumnLink" />
                    <AccessControl requiredLevel="level1" fallback={<div>Access Denied</div>}>
                        <MemberList />
                    </AccessControl>
                </UserLayout>
            </ProtectedRoute>
        ),
    },
    {
        path: "/access/network-actions",
        element: (
            <ProtectedRoute>
                <UserLayout>
                    <PageTitle title="Network Actions | AlumnLink" />
                    <NetworkActions userAccessLevel={0} />
                </UserLayout>
            </ProtectedRoute>
        ),
    },
    {
        path: "/access/moderation",
        element: (
            <ProtectedRoute>
                <UserLayout>
                    <PageTitle title="Content Moderation | AlumnLink" />
                    <AccessControl requiredLevel="level1" fallback={<div>Access Denied</div>}>
                        <ContentModeration />
                    </AccessControl>
                </UserLayout>
            </ProtectedRoute>
        ),
    },
    {
        path: "/access/user-management",
        element: (
            <ProtectedRoute>
                <UserLayout>
                    <PageTitle title="User Management | AlumnLink" />
                    <AccessControl requiredLevel="level2" fallback={<div>Access Denied</div>}>
                        <UserManagement />
                    </AccessControl>
                </UserLayout>
            </ProtectedRoute>
        ),
    },
    {
        path: "/access/network-settings",
        element: (
            <ProtectedRoute>
                <UserLayout>
                    <PageTitle title="Network Settings | AlumnLink" />
                    <AccessControl requiredLevel="level3" fallback={<div>Access Denied</div>}>
                        <NetworkSettings />
                    </AccessControl>
                </UserLayout>
            </ProtectedRoute>
        ),
    },
    {
        path: "/access/admin-panel",
        element: (
            <ProtectedRoute>
                <UserLayout>
                    <PageTitle title="Admin Panel | AlumnLink" />
                    <AccessControl requiredLevel="level4" fallback={<div>Access Denied</div>}>
                        <AdminPanel />
                    </AccessControl>
                </UserLayout>
            </ProtectedRoute>
        ),
    },
    {
        path: "/access/system-control",
        element: (
            <ProtectedRoute>
                <UserLayout>
                    <PageTitle title="System Control | AlumnLink" />
                    <AccessControl requiredLevel="level5" fallback={<div>Access Denied</div>}>
                        <SystemControl />
                    </AccessControl>
                </UserLayout>
            </ProtectedRoute>
        ),
    }
];


