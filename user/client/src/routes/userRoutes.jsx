


import React from 'react'
import Layout from '../components/layout/Layout';
import PageTitle from '../utils/PageTitle';
import HomePage from '../pages/HomePage';


import NotificationsPage from '../pages/NotificationsPage';
import NetworkPage from '../pages/NetworkPage';
import PostPage from '../pages/PostPage';
import ProfilePage from '../pages/ProfilePage';
import JoinNetwork from '../pages/joinNetwork';

const userRoutes = [
    { 
        path: "/", 
        
        element: (
            <Layout>
                <PageTitle title="Home | AlumnLink" />
                <JoinNetwork/>
            </Layout>
        )
    },

    { 
        path: "/home", 
        element: (
            <Layout>
                <PageTitle title="Home | AlumnLink" />
                <HomePage />
            </Layout>
        )
    },
    { 
        path: "/notifications", 
        element: (
            <Layout>
                <PageTitle title="Notifications | AlumnLink" />
                <NotificationsPage />
            </Layout>
        )
    },
    { 
        path: "/network", 
        element: (
            <Layout>
                <PageTitle title="Network | AlumnLink" />
                <NetworkPage />
            </Layout>
        )
    },
    { 
        path: "/post/:postId", 
        element: (
            <Layout>
                <PageTitle title="Post | AlumnLink" />
                <PostPage />
            </Layout>
        )
    },
    { 
        path: "/profile/:username", 
        element: (
            <Layout>
                <PageTitle title="Profile | AlumnLink" />
                <ProfilePage />
            </Layout>
        )
    },
];


export default userRoutes