"use client"

import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { axiosInstance } from "@/lib/axios"
import { toast } from "react-hot-toast"
import { Bell, ExternalLink, Eye, MessageSquare, ThumbsUp, Trash2, UserPlus } from "lucide-react"
import { Link } from "react-router-dom"
import { formatDistanceToNow } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"

import Sidebar from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

const NotificationsPage = () => {
  const [activeTab, setActiveTab] = useState("all")
  const queryClient = useQueryClient()

  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
  })

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => axiosInstance.get("/notifications"),
  })

  const { mutate: markAsReadMutation } = useMutation({
    mutationFn: (id) => axiosInstance.put(`/notifications/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"])
      toast.success("Marked as read")
    },
  })

  const { mutate: markAllAsReadMutation } = useMutation({
    mutationFn: () => axiosInstance.put(`/notifications/mark-all-read`),
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"])
      toast.success("All notifications marked as read")
    },
  })

  const { mutate: deleteNotificationMutation } = useMutation({
    mutationFn: (id) => axiosInstance.delete(`/notifications/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"])
      toast.success("Notification deleted")
    },
  })

  const filteredNotifications = notifications?.data?.filter((notification) => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !notification.read
    return notification.type === activeTab
  })

  const unreadCount = notifications?.data?.filter((n) => !n.read).length || 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-screen bg-gray-50">
      <div className="col-span-1 lg:col-span-1">
        <Sidebar user={authUser} />
      </div>
      <div className="col-span-1 lg:col-span-3 py-6 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <motion.div whileHover={{ rotate: 15 }} transition={{ type: "spring", stiffness: 400 }}>
                  <Bell className="h-6 w-6 text-purple-500" />
                </motion.div>
                <h1 className="text-2xl font-bold">Notifications</h1>
                {unreadCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                      {unreadCount} unread
                    </Badge>
                  </motion.div>
                )}
              </div>

              {unreadCount > 0 && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="sm" onClick={() => markAllAsReadMutation()} className="text-sm">
                    Mark all as read
                  </Button>
                </motion.div>
              )}
            </div>

            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 md:w-auto md:inline-flex">
                <TabsTrigger value="all" className="text-sm">
                  All
                </TabsTrigger>
                <TabsTrigger value="unread" className="text-sm">
                  Unread
                </TabsTrigger>
                <TabsTrigger value="like" className="text-sm">
                  Likes
                </TabsTrigger>
                <TabsTrigger value="comment" className="text-sm">
                  Comments
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="p-6">
            {isLoading ? (
              <NotificationSkeleton />
            ) : filteredNotifications && filteredNotifications.length > 0 ? (
              <AnimatePresence initial={false} mode="popLayout">
                <ul className="space-y-4">
                  {filteredNotifications.map((notification) => (
                    <NotificationItem
                      key={notification._id}
                      notification={notification}
                      onMarkAsRead={markAsReadMutation}
                      onDelete={deleteNotificationMutation}
                    />
                  ))}
                </ul>
              </AnimatePresence>
            ) : (
              <EmptyState type={activeTab} />
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

const NotificationItem = ({ notification, onMarkAsRead, onDelete }) => {
  const renderNotificationIcon = (type) => {
    switch (type) {
      case "like":
        return (
          <div className="p-2 bg-blue-50 text-blue-500 rounded-full">
            <ThumbsUp className="h-4 w-4" />
          </div>
        )
      case "comment":
        return (
          <div className="p-2 bg-green-50 text-green-500 rounded-full">
            <MessageSquare className="h-4 w-4" />
          </div>
        )
      case "LinkAccepted":
        return (
          <div className="p-2 bg-purple-50 text-purple-500 rounded-full">
            <UserPlus className="h-4 w-4" />
          </div>
        )
      default:
        return null
    }
  }

  const renderNotificationContent = (notification) => {
    switch (notification.type) {
      case "like":
        return (
          <span>
            <Link to={`/profile/${notification.relatedUser.username}`} className="font-medium hover:underline">
              {notification.relatedUser.name}
            </Link>{" "}
            liked your post
          </span>
        )
      case "comment":
        return (
          <span>
            <Link to={`/profile/${notification.relatedUser.username}`} className="font-medium hover:underline">
              {notification.relatedUser.name}
            </Link>{" "}
            commented on your post
          </span>
        )
      case "LinkAccepted":
        return (
          <span>
            <Link to={`/profile/${notification.relatedUser.username}`} className="font-medium hover:underline">
              {notification.relatedUser.name}
            </Link>{" "}
            accepted your Link request
          </span>
        )
      default:
        return null
    }
  }

  const renderRelatedPost = (relatedPost) => {
    if (!relatedPost) return null

    return (
      <Link
        to={`/post/${relatedPost._id}`}
        className="mt-3 p-3 bg-gray-50 rounded-lg flex items-center space-x-3 hover:bg-gray-100 transition-all group"
      >
        {relatedPost.image && (
          <img
            src={relatedPost.image || "/placeholder.svg"}
            alt="Post preview"
            className="w-12 h-12 object-cover rounded-md"
          />
        )}
        <div className="flex-1 overflow-hidden">
          <p className="text-sm text-gray-600 line-clamp-2">{relatedPost.content}</p>
        </div>
        <ExternalLink size={16} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
      </Link>
    )
  }

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0, overflow: "hidden" }}
      transition={{ duration: 0.2 }}
      className={`bg-white border rounded-xl p-4 transition-all hover:shadow-md ${
        !notification.read ? "border-purple-200 bg-purple-50/30" : "border-gray-200"
      }`}
    >
      <div className="flex items-start gap-4">
        <motion.div whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 400 }}>
          <Link to={`/profile/${notification.relatedUser.username}`}>
            <img
              src={notification.relatedUser.profilePicture || "/avatar.png"}
              alt={notification.relatedUser.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
            />
          </Link>
        </motion.div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            {renderNotificationIcon(notification.type)}
            <p className="text-sm">{renderNotificationContent(notification)}</p>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {formatDistanceToNow(new Date(notification.createdAt), {
              addSuffix: true,
            })}
          </p>
          {renderRelatedPost(notification.relatedPost)}
        </div>

        <div className="flex gap-2 self-start">
          {!notification.read && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onMarkAsRead(notification._id)}
              className="p-2 bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200 transition-colors"
              aria-label="Mark as read"
            >
              <Eye size={14} />
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(notification._id)}
            className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
            aria-label="Delete notification"
          >
            <Trash2 size={14} />
          </motion.button>
        </div>
      </div>
    </motion.li>
  )
}

const NotificationSkeleton = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/4" />
            <Skeleton className="h-16 w-full mt-2" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  )
}

const EmptyState = ({ type }) => {
  let message = "No notifications at the moment"

  if (type === "unread") {
    message = "No unread notifications"
  } else if (type === "like") {
    message = "No likes yet"
  } else if (type === "comment") {
    message = "No comments yet"
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
        className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4"
      >
        <Bell className="h-8 w-8 text-gray-400" />
      </motion.div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">{message}</h3>
      <p className="text-gray-500 max-w-sm mx-auto">When you receive new notifications, they'll appear here</p>
    </motion.div>
  )
}

export default NotificationsPage
