import HomePage from "../pages/HomePage";
import NotificationsPage from "../pages/NotificationsPage";
import NetworkPage from "../pages/NetworkPage";
import PostPage from "../pages/PostPage";
import ProfilePage from "../pages/ProfilePage";

const userRoutes = [
    { path: "/", element: <HomePage /> },
    { path: "/notifications", element: <NotificationsPage /> },
    { path: "/network", element: <NetworkPage /> },
    { path: "/post/:postId", element: <PostPage /> },
    { path: "/profile/:username", element: <ProfilePage /> },
];

export default userRoutes;
