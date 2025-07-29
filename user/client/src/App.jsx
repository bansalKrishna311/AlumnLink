import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./Landing/Layout";
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
import About from './Landing/Pages/About';
import Terms from './Landing/Pages/Terms';
import Contact from './Landing/Pages/Contact';
import ProfilePage from "./pages/ProfilePage";
import UserPostsPage from "./pages/UserPostsPage";
import NotFoundPage from "./pages/NotFoundPage";
import ErrorBoundary from "./components/ErrorBoundary";
import Test404Page from "./pages/Test404Page";

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
                // Don't show error toast for 404
                if (err.response && err.response.status !== 404) {
                    toast.error("Unable to connect to server. Please try again later.");
                }
                return null;
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
        <ErrorBoundary>
            <Routes>
                {/* Root path redirect */}
                <Route path="/" element={<Navigate to="/Landing" replace />} />
           
                <Route path="/Landing" element={<Layout />}>
                    <Route index element={<LandHome />} /> {/* /Landing */}
                    <Route path="about" element={<About />} /> {/* /Landing/about */}
                    <Route path="terms" element={<Terms />} /> {/* /Landing/terms */}
                    <Route path="contact" element={<Contact />} /> {/* /Landing/contact */}
                    <Route path="*" element={<NotFoundPage />} /> {/* 404 for Landing sub-routes */}
                </Route>

                <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
                <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
                <Route path="/forgot-password" element={!authUser ? <ForgotPasswordPage /> : <Navigate to="/" />} />
                <Route path="/reset-password/:token" element={<PasswordResetPage />} />
                
                {/* Temporary test route for 404 functionality */}
                <Route path="/test-404" element={<Test404Page />} />
                
                {/* Render role-specific routes */}
                {authUser ? (
                    getRoutesByRole().map((route) => (
                        <Route key={route.path} path={route.path} element={route.element} />
                    ))
                ) : (
                    <Route path="*" element={<Navigate to="/Landing" />} />
                )}
                
                {/* 404 Not Found route - should be the last route */}
                {authUser && <Route path="*" element={<NotFoundPage />} />}
            </Routes>
            <Toaster />
        </ErrorBoundary>
    );
}

export default App;
