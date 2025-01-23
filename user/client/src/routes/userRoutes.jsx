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

import UserLinksPage from "@/components/UserLinksModal";

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
                <NetworkPage />
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
];


