import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import ProfileHeader from "@/components/ProfileHeader";
import AboutSection from "@/components/AboutSection";
import ExperienceSection from "@/components/ExperienceSection";
import EducationSection from "@/components/EducationSection";
import SkillsSection from "@/components/SkillsSection";
import UserPostsSection from "@/components/UserPostsSection";
import ContributionGraph from "@/components/ContributionGraph";
import toast from "react-hot-toast";

const ProfilePage = () => {
    const { username } = useParams();
    const queryClient = useQueryClient();

    const { data: authUser, isLoading } = useQuery({
        queryKey: ["authUser"],
        queryFn: () => axiosInstance.get("/auth/me").then((res) => res.data),
    });

    const { data: userProfile, isLoading: isUserProfileLoading } = useQuery({
        queryKey: ["userProfile", username],
        queryFn: () => axiosInstance.get(`/users/${username}`).then((res) => res.data),
    });

    // Fetch user contributions for the contribution graph (only for regular users)
    const { data: contributionData } = useQuery({
        queryKey: ["userContributions", username],
        queryFn: () => axiosInstance.get(`/users/contributions/${username}`).then((res) => res.data.data),
        enabled: !!username && userProfile?.role === "user", // Only fetch for regular users
    });

    const { mutate: updateProfile } = useMutation({
        mutationFn: async (updatedData) => {
            await axiosInstance.put("/users/profile", updatedData);
        },
        onSuccess: () => {
            toast.success("Profile updated successfully");
            queryClient.invalidateQueries(["userProfile", username]);
        },
    });

    if (isLoading || isUserProfileLoading) return <p>Loading...</p>;

    if (!authUser || !userProfile) return <p>Error loading profile.</p>;

    const isOwnProfile = authUser.username === userProfile.username;
    const userData = isOwnProfile ? authUser : userProfile;
    const isAdmin = userData.role === "admin";

    const handleSave = (updatedData) => {
        updateProfile(updatedData);
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <ProfileHeader userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
            <AboutSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
            {/* Only show contribution graph for regular users (not admin or superadmin) */}
            {userData.role === "user" && (
                <ContributionGraph 
                    username={username} 
                    isOwnProfile={isOwnProfile} 
                    contributionData={contributionData || []}
                    className="mb-6" 
                />
            )}
            <UserPostsSection username={username} isOwnProfile={isOwnProfile} />
            {!isAdmin && (
                <>
                    <ExperienceSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
                    <EducationSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
                    <SkillsSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
                </>
            )}
        </div>
    );
};

export default ProfilePage;
