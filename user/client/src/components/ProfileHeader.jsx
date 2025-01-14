import React, { useState, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
import { Camera, Clock, MapPin, UserCheck, UserPlus, X, Edit3 } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const ProfileHeader = ({ userData, onSave, isOwnProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const queryClient = useQueryClient();
  const navigate = useNavigate(); // Initialize navigate

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const { data: Linkstatus, refetch: refetchLinkstatus } = useQuery({
    queryKey: ["Linkstatus", userData._id],
    queryFn: () => axiosInstance.get(`/Links/status/${userData._id}`),
    enabled: !isOwnProfile,
  });

  const isLinked = userData.Links.some((Link) => Link === authUser._id);

  const { mutate: sendLinkRequest } = useMutation({
    mutationFn: (userId) => axiosInstance.post(`/Links/request/${userId}`),
    onSuccess: () => {
      toast.success("Link request sent");
      refetchLinkstatus();
      queryClient.invalidateQueries(["LinkRequests"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "An error occurred");
    },
  });

  const { mutate: acceptRequest } = useMutation({
    mutationFn: (requestId) => axiosInstance.put(`/Links/accept/${requestId}`),
    onSuccess: () => {
      toast.success("Link request accepted");
      refetchLinkstatus();
      queryClient.invalidateQueries(["LinkRequests"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "An error occurred");
    },
  });

  const { mutate: rejectRequest } = useMutation({
    mutationFn: (requestId) => axiosInstance.put(`/Links/reject/${requestId}`),
    onSuccess: () => {
      toast.success("Link request rejected");
      refetchLinkstatus();
      queryClient.invalidateQueries(["LinkRequests"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "An error occurred");
    },
  });

  const { mutate: removeLink } = useMutation({
    mutationFn: (userId) => axiosInstance.delete(`/Links/${userId}`),
    onSuccess: () => {
      toast.success("Link removed");
      refetchLinkstatus();
      queryClient.invalidateQueries(["LinkRequests"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "An error occurred");
    },
  });

  const getLinkstatus = useMemo(() => {
    if (isLinked) return "Linked";
    if (!isLinked) return "not_Linked";
    return Linkstatus?.data?.status;
  }, [isLinked, Linkstatus]);

  const renderLinkButton = () => {
    const baseClass = "text-white py-2 px-4 rounded-full transition duration-300 flex items-center justify-center";
    switch (getLinkstatus) {
      case "Linked":
        return (
          <div className="flex gap-2 justify-center">
            <div className={`${baseClass} bg-green-500 hover:bg-green-600`}>
              <UserCheck size={20} className="mr-2" />
              Linked
            </div>
            <button
              className={`${baseClass} bg-red-500 hover:bg-red-600 text-sm`}
              onClick={() => removeLink(userData._id)}
            >
              <X size={20} className="mr-2" />
              Remove Link
            </button>
          </div>
        );

      case "pending":
        return (
          <button className={`${baseClass} bg-yellow-500 hover:bg-yellow-600`}>
            <Clock size={20} className="mr-2" />
            Pending
          </button>
        );

      case "received":
        return (
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => acceptRequest(Linkstatus.data.requestId)}
              className={`${baseClass} bg-green-500 hover:bg-green-600`}
            >
              Accept
            </button>
            <button
              onClick={() => rejectRequest(Linkstatus.data.requestId)}
              className={`${baseClass} bg-red-500 hover:bg-red-600`}
            >
              Reject
            </button>
          </div>
        );
      default:
        return (
          <button
            onClick={() => sendLinkRequest(userData._id)}
            className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-full transition duration-300 flex items-center justify-center"
          >
            <UserPlus size={20} className="mr-2" />
            Link
          </button>
        );
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedData((prev) => ({ ...prev, [event.target.name]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave(editedData);
    setIsEditing(false);
  };

  const handleLinkCountClick = () => {
    navigate(`/links/${userData._id}`); // Navigate to the new page
  };

  return (
    <div className="bg-white shadow rounded-lg mb-6">
      <div
        className="relative h-48 rounded-t-lg bg-cover bg-center"
        style={{
          backgroundImage: `url('${editedData.bannerImg || userData.bannerImg || "/banner.png"}')`,
        }}
      >
        {isEditing && (
          <label className="absolute top-2 right-2 bg-white p-2 rounded-full shadow cursor-pointer">
            <Camera size={20} />
            <input
              type="file"
              className="hidden"
              name="bannerImg"
              onChange={handleImageChange}
              accept="image/*"
            />
          </label>
        )}

        {isOwnProfile && !isEditing && (
          <div className="absolute top-2 right-2 bg-white p-2 rounded-full shadow">
            <Edit3
              size={24}
              className="cursor-pointer text-gray-500 hover:text-gray-700"
              onClick={() => setIsEditing(true)}
            />
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="relative -mt-20 mb-4">
          <img
            className="w-32 h-32 rounded-full mx-auto object-cover"
            src={editedData.profilePicture || userData.profilePicture || "/avatar.png"}
            alt={userData.name}
          />

          {isEditing && (
            <label className="absolute bottom-0 right-1/2 transform translate-x-16 bg-white p-2 rounded-full shadow cursor-pointer">
              <Camera size={20} />
              <input
                type="file"
                className="hidden"
                name="profilePicture"
                onChange={handleImageChange}
                accept="image/*"
              />
            </label>
          )}
        </div>

        <div className="text-center mb-4">
          {isEditing ? (
            <input
              type="text"
              value={editedData.name ?? userData.name}
              onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
              className="text-2xl font-bold mb-2 text-center w-full"
            />
          ) : (
            <h1 className="text-2xl font-bold mb-2">{userData.name}</h1>
          )}

          {isEditing ? (
            <input
              type="text"
              value={editedData.headline ?? userData.headline}
              onChange={(e) => setEditedData({ ...editedData, headline: e.target.value })}
              className="text-gray-600 text-center w-full"
            />
          ) : (
            <p className="text-gray-600">{userData.headline}</p>
          )}

          <div className="flex justify-center items-center mt-2">
            <MapPin size={16} className="text-gray-500 mr-1" />
            {isEditing ? (
              <input
                type="text"
                value={editedData.location ?? userData.location}
                onChange={(e) => setEditedData({ ...editedData, location: e.target.value })}
                className="text-gray-600 text-center"
              />
            ) : (
              <span className="text-gray-600">{userData.location}</span>
            )}
          </div>
        </div>

        <div className="flex justify-center gap-10 align-middle">
          <div
            className="text-gray-700 font-bold cursor-pointer"
            onClick={handleLinkCountClick}
          >
            {userData.Links.length} Links
          </div>

          {!isOwnProfile && renderLinkButton()}

          {isEditing && (
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-full"
              onClick={handleSave}
            >
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
