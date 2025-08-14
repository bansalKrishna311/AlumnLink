import { createBrowserRouter } from "react-router-dom";
import { Suspense } from "react";
import AuthLayout from "@/layouts/AuthLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import Dashboard from "@/app/dashboard/page";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import AuthRequirePage from "@/pages/AuthRequirePage";
import ProfilePage from "@/pages/ProfilePage";
import LandingPage from "@/Landing/LandingPage";
import AdminDashboard from "@/admin/Dashboard";
import React, { lazy } from "react";
const AdminDashboard = lazy(() => import("@/admin/Dashboard"));
const PostRequest = lazy(() => import("@/admin/PostRequest"));
const RejectedRequests = lazy(() => import("@/admin/rejectedRequests"));
const AdminPosts = lazy(() => import("@/admin/AdminPosts"));
const ManageUsers = lazy(() => import("@/admin/ManageUsers"));
const PostCreationPage = lazy(() => import("@/admin/PostCreationPage"));
const ManageAlumni = lazy(() => import("@/admin/manage-alumni"));
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
        <Suspense fallback={<div />}> 
          <AdminDashboard />
        </Suspense>
      </DashboardLayout>
    ),
  },
  {
    path: "/admin/posts",
    element: (
      <DashboardLayout>
        <Suspense fallback={<div />}> 
          <AdminPosts />
        </Suspense>
      </DashboardLayout>
    ),
  },
  {
    path: "/admin/manage-alumni",
    element: (
      <DashboardLayout>
        <Suspense fallback={<div />}> 
          <ManageAlumni />
        </Suspense>
      </DashboardLayout>
    ),
  },
  {
    path: "/admin/post-requests",
    element: (
      <DashboardLayout>
        <Suspense fallback={<div />}> 
          <PostRequest />
        </Suspense>
      </DashboardLayout>
    ),
  },
  {
    path: "/admin/rejected-requests",
    element: (
      <DashboardLayout>
        <Suspense fallback={<div />}> 
          <RejectedRequests />
        </Suspense>
      </DashboardLayout>
    ),
  },
  {
    path: "/admin/manage-users",
    element: (
      <DashboardLayout>
        <Suspense fallback={<div />}> 
          <ManageUsers />
        </Suspense>
      </DashboardLayout>
    ),
  },
  {
    path: "/admin/create-post",
    element: (
      <DashboardLayout>
        <Suspense fallback={<div />}> 
          <PostCreationPage />
        </Suspense>
      </DashboardLayout>
    ),
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);