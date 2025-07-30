import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "@/layouts/AuthLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import Dashboard from "@/app/dashboard/page";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import AuthRequirePage from "@/pages/AuthRequirePage";
import ProfilePage from "@/pages/ProfilePage";
import LandingPage from "@/Landing/LandingPage";
import AdminDashboard from "@/admin/Dashboard";
import PostPage from "@/pages/PostPage"; // Changed from SinglePost to PostPage
import PostRequest from "@/admin/PostRequest";
import RejectedRequests from "@/admin/rejectedRequests";
import AdminPosts from "@/admin/AdminPosts";
import ManageUsers from "@/admin/ManageUsers";
import PostCreationPage from "@/admin/PostCreationPage";
import ManageAlumni from "@/admin/manage-alumni";
import BookmarksPage from "@/pages/BookmarksPage";
import ChatPage from "@/pages/ChatPage";
import NotificationsPage from "@/pages/NotificationsPage";
import SearchPage from "@/pages/SearchPage";
import HashtagPage from "@/pages/HashtagPage";
import TrendingHashtagsPage from "@/pages/TrendingHashtagsPage";
import NotFoundPage from "@/pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: (
      <AuthLayout>
        <Login />
      </AuthLayout>
    ),
  },
  {
    path: "/register",
    element: (
      <AuthLayout>
        <Register />
      </AuthLayout>
    ),
  },
  {
    path: "/auth-require",
    element: <AuthRequirePage />,
  },
  {
    path: "/dashboard",
    element: (
      <DashboardLayout>
        <Dashboard />
      </DashboardLayout>
    ),
  },
  {
    path: "/profile/:username",
    element: (
      <DashboardLayout>
        <ProfilePage />
      </DashboardLayout>
    ),
  },
  {
    path: "/post/:postId",
    element: (
      <DashboardLayout>
        <PostPage />
      </DashboardLayout>
    ),
  },
  {
    path: "/bookmarks",
    element: (
      <DashboardLayout>
        <BookmarksPage />
      </DashboardLayout>
    ),
  },
  {
    path: "/chat",
    element: (
      <DashboardLayout>
        <ChatPage />
      </DashboardLayout>
    ),
  },
  {
    path: "/notifications",
    element: (
      <DashboardLayout>
        <NotificationsPage />
      </DashboardLayout>
    ),
  },
  {
    path: "/search",
    element: (
      <DashboardLayout>
        <SearchPage />
      </DashboardLayout>
    ),
  },
  {
    path: "/hashtag/:tag",
    element: (
      <DashboardLayout>
        <HashtagPage />
      </DashboardLayout>
    ),
  },
  {
    path: "/trending-hashtags",
    element: (
      <DashboardLayout>
        <TrendingHashtagsPage />
      </DashboardLayout>
    ),
  },
  {
    path: "/admin",
    element: (
      <DashboardLayout>
        <AdminDashboard />
      </DashboardLayout>
    ),
  },
  {
    path: "/admin/posts",
    element: (
      <DashboardLayout>
        <AdminPosts />
      </DashboardLayout>
    ),
  },
  {
    path: "/admin/manage-alumni",
    element: (
      <DashboardLayout>
        <ManageAlumni />
      </DashboardLayout>
    ),
  },
  {
    path: "/admin/post-requests",
    element: (
      <DashboardLayout>
        <PostRequest />
      </DashboardLayout>
    ),
  },
  {
    path: "/admin/rejected-requests",
    element: (
      <DashboardLayout>
        <RejectedRequests />
      </DashboardLayout>
    ),
  },
  {
    path: "/admin/manage-users",
    element: (
      <DashboardLayout>
        <ManageUsers />
      </DashboardLayout>
    ),
  },
  {
    path: "/admin/create-post",
    element: (
      <DashboardLayout>
        <PostCreationPage />
      </DashboardLayout>
    ),
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);