import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import SignUpPage from "./pages/auth/SignUpPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import AdminPage from "./admin/AdminPage"; // New Admin page component
import SuperAdminPage from "./superadmin/SuperAdminPage"; // New SuperAdmin page component
import toast, { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "./lib/axios";
import NotificationsPage from "./pages/NotificationsPage";
import NetworkPage from "./pages/NetworkPage";
import PostPage from "./pages/PostPage";
import ProfilePage from "./pages/ProfilePage";
import PasswordResetPage from "./pages/auth/PasswordResetPage";

function App() {
    const { data: authUser, isLoading } = useQuery({
        queryKey: ["authUser"],
        queryFn: async () => {
            try {
                const res = await axiosInstance.get("/auth/me");
                return res.data;
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    return null;
                }
                toast.error(err.response.data.message || "Something went wrong");
            }
        },
    });

    if (isLoading) return null;

    // Redirect based on role
    const getRedirectPage = () => {
        if (authUser?.role === "admin") return <AdminPage />;
        if (authUser?.role === "superadmin") return <SuperAdminPage />;
        return <HomePage />; // Default for regular users
    };

    return (
        <Layout>
            <Routes>
                <Route path="/" element={authUser ? getRedirectPage() : <Navigate to={"/login"} />} />
                <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />} />
                <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to={"/"} />} />
                <Route path="/forgot-password" element={!authUser ? <ForgotPasswordPage /> : <Navigate to={"/"} />} />
                <Route path="/reset-password/:token" element={<PasswordResetPage />} />
                <Route path="/notifications" element={authUser ? <NotificationsPage /> : <Navigate to={"/login"} />} />
                <Route path="/network" element={authUser ? <NetworkPage /> : <Navigate to={"/login"} />} />
                <Route path="/post/:postId" element={authUser ? <PostPage /> : <Navigate to={"/login"} />} />
                <Route path="/profile/:username" element={authUser ? <ProfilePage /> : <Navigate to={"/login"} />} />
            </Routes>
            <Toaster />
        </Layout>
    );
}

export default App;
