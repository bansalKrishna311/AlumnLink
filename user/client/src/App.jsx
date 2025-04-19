import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import LoginPage from "./pages/auth/LoginPage";
import SignUpPage from "./pages/auth/SignUpPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import PasswordResetPage from "./pages/auth/PasswordResetPage";
import toast, { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "./lib/axios";
import {userRoutes} from "./routes/userRoutes";
import {adminRoutes} from "./routes/adminRoutes";
import {superAdminRoutes} from "./routes/superAdminRoutes";
import LandHome from "./Landing/Pages/LandHome";
import ProfilePage from "./pages/ProfilePage";
import UserPostsPage from "./pages/UserPostsPage";

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

    const getRoutesByRole = () => {
        switch (authUser?.role) {
            case "admin":
                return adminRoutes;
            case "superadmin":
                return superAdminRoutes;
            default:
                return userRoutes;
        }
    };

    return (
        <>
            <Routes>
            <Route path="/Landing" element={!authUser ? <LandHome /> : <Navigate to="/" />} />

                <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
                <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
                <Route path="/forgot-password" element={!authUser ? <ForgotPasswordPage /> : <Navigate to="/" />} />
                <Route path="/reset-password/:token" element={<PasswordResetPage />} />
                
                {/* Render role-specific routes */}
                {authUser ? (
                    getRoutesByRole().map((route) => (
                        <Route key={route.path} path={route.path} element={route.element} />
                    ))
                ) : (
                    <Route path="*" element={<Navigate to="/Landing" />} />
                )}
            </Routes>
            <Toaster />
        </>
    );
}

export default App;
