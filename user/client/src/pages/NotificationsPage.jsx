import { useState, useEffect } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { axiosInstance } from "@/lib/axios"
import { toast } from "react-hot-toast"
import { Bell, ExternalLink, Eye, MessageSquare, ThumbsUp, Trash2, UserPlus, AtSign, CheckCircle, XCircle } from "lucide-react"
import { Link } from "react-router-dom"
import { formatDistanceToNow } from "date-fns"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"

import Sidebar from "@/components/Sidebar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import VirtualizedList from "@/components/VirtualizedList"
import OptimizedVirtualList from "@/components/OptimizedVirtualList"
import { useLargeDataset } from "@/hooks/useLargeDataset"
// import { usePerformanceBenchmark } from "@/utils/performanceBenchmark"

// Main color: #fe6019 (vibrant orange)
const THEME_COLOR = "#fe6019"
const THEME_COLOR_LIGHT = "rgba(254, 96, 25, 0.1)"
const THEME_COLOR_MEDIUM = "rgba(254, 96, 25, 0.2)"

const NotificationsPage = () => {
  const [activeTab, setActiveTab] = useState("all")
  const [isMobile, setIsMobile] = useState(false)
  const queryClient = useQueryClient()
  const prefersReducedMotion = useReducedMotion()

  // Performance monitoring (commented out for now)
  // const benchmarks = usePerformanceBenchmark('NotificationsPage');

  // Responsive handler
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize() // Initial check
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
  })

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => axiosInstance.get("/notifications"),
  })

  // Memory-optimized data handling for large notification lists
  const filteredNotifications = notifications?.data?.filter((notification) => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !notification.read
    return notification.type === activeTab
  }) || []

  const {
    currentData: paginatedNotifications,
    totalItems,
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
    goToPage
  } = useLargeDataset(filteredNotifications, {
    pageSize: 20, // Show 20 notifications per page
    maxMemoryItems: 100, // Keep max 100 notifications in memory
    debounceMs: 200
  })

  // Mutation hooks for notification actions
  const { mutate: markAsReadMutation } = useMutation({
    mutationFn: (id) => axiosInstance.put(`/notifications/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"])
      toast.success("Marked as read")
    },
  })

  const { mutate: markAllAsReadMutation, isPending: isMarkingAllAsRead } = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.put(`/notifications/mark-all-read`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
      toast.success("All notifications marked as read");
    },
    onError: (error) => {
      console.error("Error marking all as read:", error);
      toast.error("Failed to mark all notifications as read");
    }
  });

  const { mutate: deleteNotificationMutation } = useMutation({
    mutationFn: (id) => axiosInstance.delete(`/notifications/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"])
      toast.success("Notification deleted")
    },
  })

  const unreadCount = notifications?.data?.filter((n) => !n.read).length || 0

  // Reset to first page when tab changes
  useEffect(() => {
    goToPage(0);
  }, [activeTab, goToPage]);

  // Animation variants for smooth transitions
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.3
      }
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6 min-h-screen px-2 sm:px-4 md:px-6">
      <div className="col-span-1 lg:col-span-1 hidden lg:block">
        <Sidebar user={authUser} />
      </div>
      <div className="col-span-1 lg:col-span-3 py-4 sm:py-6">
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden"
        >
          <div className="p-4 md:p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <motion.div 
                  whileHover={prefersReducedMotion ? {} : { rotate: 15, scale: 1.1 }} 
                  transition={{ type: "spring", stiffness: 400 }}
                  style={{ color: THEME_COLOR }}
                >
                  <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
                </motion.div>
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold">Notifications</h1>
                {unreadCount > 0 && (
                  <motion.div
                    initial={prefersReducedMotion ? { scale: 1 } : { scale: 0 }}
                    animate={prefersReducedMotion ? { scale: 1 } : { scale: 1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    <Badge 
                      variant="secondary" 
                      style={{ 
                        backgroundColor: THEME_COLOR_LIGHT, 
                        color: THEME_COLOR 
                      }} 
                      className="hover:bg-opacity-80 transition-all text-xs"
                    >
                      {unreadCount} unread
                    </Badge>
                  </motion.div>
                )}
              </div>

              {unreadCount > 0 && (
                <motion.div 
                  whileHover={prefersReducedMotion ? {} : { scale: 1.05 }} 
                  whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                  className="flex-shrink-0"
                >
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => markAllAsReadMutation()} 
                    disabled={isMarkingAllAsRead}
                    className="text-sm whitespace-nowrap"
                    style={{ 
                      borderColor: THEME_COLOR_LIGHT, 
                      color: THEME_COLOR 
                    }}
                  >
                    <Eye className="h-3.5 w-3.5 mr-1.5" />
                    {isMarkingAllAsRead ? "Marking..." : "Mark all as read"}
                  </Button>
                </motion.div>
              )}
            </div>

            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} md:w-auto md:inline-flex gap-1 w-full overflow-x-auto scrollbar-hide`}>
                <TabsTrigger 
                  value="all" 
                  className="text-xs sm:text-sm data-[state=active]:bg-opacity-10 px-2 sm:px-4"
                  style={{ 
                    "--tab-accent": THEME_COLOR,
                    color: activeTab === "all" ? THEME_COLOR : "inherit"
                  }}
                >
                  All
                </TabsTrigger>
                <TabsTrigger 
                  value="unread" 
                  className="text-xs sm:text-sm data-[state=active]:bg-opacity-10 px-2 sm:px-4"
                  style={{ 
                    "--tab-accent": THEME_COLOR,
                    color: activeTab === "unread" ? THEME_COLOR : "inherit"
                  }}
                >
                  Unread
                </TabsTrigger>
                <TabsTrigger 
                  value="like" 
                  className="text-xs sm:text-sm data-[state=active]:bg-opacity-10 px-2 sm:px-4"
                  style={{ 
                    "--tab-accent": THEME_COLOR,
                    color: activeTab === "like" ? THEME_COLOR : "inherit"
                  }}
                >
                  Likes
                </TabsTrigger>
                <TabsTrigger 
                  value="comment" 
                  className="text-xs sm:text-sm data-[state=active]:bg-opacity-10 px-2 sm:px-4"
                  style={{ 
                    "--tab-accent": THEME_COLOR,
                    color: activeTab === "comment" ? THEME_COLOR : "inherit"
                  }}
                >
                  Comments
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="p-4 md:p-6">
            {isLoading ? (
              <NotificationSkeleton />
            ) : paginatedNotifications && paginatedNotifications.length > 0 ? (
              <div className="space-y-4">
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.ul 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-4"
                  >
                    {paginatedNotifications.map((notification) => (
                      <NotificationItem
                        key={notification._id}
                        notification={notification}
                        onMarkAsRead={markAsReadMutation}
                        onDelete={deleteNotificationMutation}
                        prefersReducedMotion={prefersReducedMotion}
                      />
                    ))}
                  </motion.ul>
                </AnimatePresence>
                
                {/* Pagination controls for large datasets */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-6 pt-4 border-t border-gray-100">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={prevPage}
                      disabled={!hasPrevPage}
                      className="text-sm"
                    >
                      Previous
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        const pageNum = Math.max(0, Math.min(currentPage - 2, totalPages - 5)) + i;
                        if (pageNum >= totalPages) return null;
                        
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => goToPage(pageNum)}
                            className="w-8 h-8 p-0 text-xs"
                            style={{
                              backgroundColor: currentPage === pageNum ? THEME_COLOR : 'transparent',
                              borderColor: currentPage === pageNum ? THEME_COLOR : undefined,
                            }}
                          >
                            {pageNum + 1}
                          </Button>
                        );
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={nextPage}
                      disabled={!hasNextPage}
                      className="text-sm"
                    >
                      Next
                    </Button>
                    
                    <span className="text-xs text-gray-500 ml-3">
                      {totalItems} total notifications
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <EmptyState type={activeTab} prefersReducedMotion={prefersReducedMotion} />
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

const NotificationItem = ({ notification, onMarkAsRead, onDelete, prefersReducedMotion }) => {
  // Animation variants for list items
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { 
      opacity: 0, 
      height: 0, 
      marginTop: 0, 
      marginBottom: 0, 
      overflow: "hidden",
      transition: { duration: 0.2 } 
    }
  }

  const renderNotificationIcon = (type) => {
    switch (type) {
      case "like":
        return (
          <div className="p-2 rounded-full" style={{ backgroundColor: "rgba(254, 96, 25, 0.1)", color: "#fe6019" }}>
            <ThumbsUp className="h-4 w-4" />
          </div>
        )
      case "comment":
        return (
          <div className="p-2 rounded-full" style={{ backgroundColor: "rgba(254, 96, 25, 0.1)", color: "#fe6019" }}>
            <MessageSquare className="h-4 w-4" />
          </div>
        )
      case "reply":
        return (
          <div className="p-2 rounded-full" style={{ backgroundColor: "rgba(254, 96, 25, 0.1)", color: "#fe6019" }}>
            <MessageSquare className="h-4 w-4" />
          </div>
        )
      case "mention":
        return (
          <div className="p-2 rounded-full" style={{ backgroundColor: "rgba(254, 96, 25, 0.1)", color: "#fe6019" }}>
            <AtSign className="h-4 w-4" />
          </div>
        )
      case "LinkAccepted":
        return (
          <div className="p-2 rounded-full" style={{ backgroundColor: "rgba(254, 96, 25, 0.1)", color: "#fe6019" }}>
            <UserPlus className="h-4 w-4" />
          </div>
        )
      case "postApproved":
        return (
          <div className="p-2 rounded-full" style={{ backgroundColor: "rgba(254, 96, 25, 0.1)", color: "#fe6019" }}>
            <CheckCircle className="h-4 w-4" />
          </div>
        )
      case "postRejected":
        return (
          <div className="p-2 rounded-full" style={{ backgroundColor: "rgba(254, 96, 25, 0.1)", color: "#fe6019" }}>
            <XCircle className="h-4 w-4" />
          </div>
        )
      default:
        return null
    }
  }

  const renderNotificationContent = (notification) => {
    // If there's no relatedUser, show a generic message
    if (!notification.relatedUser) {
      switch (notification.type) {
        case "like":
          return <span>Someone reacted to your post</span>;
        case "comment":
          return <span>Someone commented on your post</span>;
        case "LinkAccepted":
          return <span>Your Link request was accepted</span>;
        case "mention":
          return <span>You were mentioned in a post</span>;
        case "reply":
          return <span>Someone replied to your comment</span>;
        case "postApproved":
          return <span>Your post was approved</span>;
        case "postRejected":
          return <span>Your post was rejected</span>;
        default:
          return <span>You have a new notification</span>;
      }
    }

    // If relatedUser exists, use the personalized message
    switch (notification.type) {
      case "like":
        return (
          <span>
            <Link to={`/profile/${notification.relatedUser.username}`} className="font-medium hover:underline" style={{ color: "#fe6019" }}>
              {notification.relatedUser.name}
            </Link>{" "}
            reacted to your post
          </span>
        )
      case "comment":
        return (
          <span>
            <Link to={`/profile/${notification.relatedUser.username}`} className="font-medium hover:underline" style={{ color: "#fe6019" }}>
              {notification.relatedUser.name}
            </Link>{" "}
            commented on your post
          </span>
        )
      case "LinkAccepted":
        return (
          <span>
            <Link to={`/profile/${notification.relatedUser.username}`} className="font-medium hover:underline" style={{ color: "#fe6019" }}>
              {notification.relatedUser.name}
            </Link>{" "}
            accepted your Link request
          </span>
        )
      case "mention":
        return (
          <span>
            <Link to={`/profile/${notification.relatedUser.username}`} className="font-medium hover:underline" style={{ color: "#fe6019" }}>
              {notification.relatedUser.name}
            </Link>{" "}
            mentioned you in a post
          </span>
        )
      case "reply":
        return (
          <span>
            <Link to={`/profile/${notification.relatedUser.username}`} className="font-medium hover:underline" style={{ color: "#fe6019" }}>
              {notification.relatedUser.name}
            </Link>{" "}
            replied to your comment
          </span>
        )
      case "postApproved":
        return (
          <span>
            <Link to={`/profile/${notification.relatedUser.username}`} className="font-medium hover:underline" style={{ color: "#fe6019" }}>
              {notification.relatedUser.name}
            </Link>{" "}
            approved your post
          </span>
        )
      case "postRejected":
        return (
          <span>
            <Link to={`/profile/${notification.relatedUser.username}`} className="font-medium hover:underline" style={{ color: "#fe6019" }}>
              {notification.relatedUser.name}
            </Link>{" "}
            rejected your post
          </span>
        )
      default:
        return <span>You have a new notification</span>
    }
  }

  const renderRelatedPost = (relatedPost) => {
    if (!relatedPost) return null

    return (
      <Link
        to={`/post/${relatedPost._id}`}
        className="mt-3 p-2 sm:p-3 bg-gray-50 rounded-lg flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 hover:bg-gray-100 transition-all group"
      >
        {relatedPost.image && (
          <img
            src={relatedPost.image || "/placeholder.svg"}
            alt="Post preview"
            className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-md"
          />
        )}
        <div className="flex-1 overflow-hidden">
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{relatedPost.content}</p>
        </div>
        <ExternalLink size={14} className="text-gray-400 group-hover:text-[#fe6019] transition-colors hidden sm:block" />
      </Link>
    )
  }

  return (
    <motion.li
      layout
      variants={prefersReducedMotion ? {} : itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`bg-white border rounded-xl p-3 sm:p-4 md:p-5 transition-all hover:shadow-md ${
        !notification.read 
          ? "border-[#fe6019] bg-[rgba(254,96,25,0.05)]" 
          : "border-gray-200"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
        {notification.relatedUser ? (
          <motion.div whileHover={prefersReducedMotion ? {} : { scale: 1.1 }} transition={{ type: "spring", stiffness: 400 }}>
            <Link to={`/profile/${notification.relatedUser.username}`}>
              <img
                src={notification.relatedUser.profilePicture || "/avatar.png"}
                alt={notification.relatedUser.name}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-white shadow-sm"
              />
            </Link>
          </motion.div>
        ) : (
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
          </div>
        )}

        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            {renderNotificationIcon(notification.type)}
            <p className="text-sm sm:text-base">{renderNotificationContent(notification)}</p>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {formatDistanceToNow(new Date(notification.createdAt), {
              addSuffix: true,
            })}
          </p>
          {renderRelatedPost(notification.relatedPost)}
        </div>

        <div className="flex gap-2 self-start mt-3 sm:mt-0">
          {!notification.read && (
            <motion.button
              whileHover={prefersReducedMotion ? {} : { scale: 1.1 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.9 }}
              onClick={() => onMarkAsRead(notification._id)}
              className="p-2 rounded-full transition-colors"
              style={{ backgroundColor: "rgba(254, 96, 25, 0.1)", color: "#fe6019" }}
              aria-label="Mark as read"
            >
              <Eye size={14} />
            </motion.button>
          )}

          <motion.button
            whileHover={prefersReducedMotion ? {} : { scale: 1.1 }}
            whileTap={prefersReducedMotion ? {} : { scale: 0.9 }}
            onClick={() => onDelete(notification._id)}
            className="p-2 rounded-full transition-colors"
            style={{ backgroundColor: "rgba(254, 96, 25, 0.1)", color: "#fe6019" }}
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
    <div className="space-y-3 sm:space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 p-3 sm:p-4 border border-gray-200 rounded-xl">
          <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded-full" />
          <div className="space-y-2 flex-1 w-full">
            <Skeleton className="h-3 sm:h-4 w-full sm:w-3/4" />
            <Skeleton className="h-2 sm:h-3 w-1/3 sm:w-1/4" />
            <Skeleton className="h-12 sm:h-16 w-full mt-2" />
          </div>
          <div className="flex gap-2 mt-2 sm:mt-0 self-start">
            <Skeleton className="h-6 w-6 sm:h-8 sm:w-8 rounded-full" />
            <Skeleton className="h-6 w-6 sm:h-8 sm:w-8 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  )
}

const EmptyState = ({ type, prefersReducedMotion }) => {
  let message = "No notifications at the moment"

  if (type === "unread") {
    message = "No unread notifications"
  } else if (type === "like") {
    message = "No likes yet"
  } else if (type === "comment") {
    message = "No comments yet"
  }

  return (
    <motion.div 
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }} 
      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="text-center py-6 sm:py-8 md:py-12 px-4"
    >
      <motion.div
        initial={prefersReducedMotion ? { scale: 1 } : { scale: 0.8 }}
        animate={prefersReducedMotion ? { scale: 1 } : { scale: 1 }}
        transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
        className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full mb-3 sm:mb-4"
        style={{ backgroundColor: "rgba(254, 96, 25, 0.1)" }}
      >
        <Bell className="h-6 w-6 sm:h-8 sm:w-8" style={{ color: "#fe6019" }} />
      </motion.div>
      <h3 className="text-base sm:text-lg font-medium mb-1" style={{ color: "#fe6019" }}>{message}</h3>
      <p className="text-xs sm:text-sm text-gray-500 max-w-xs sm:max-w-sm mx-auto">When you receive new notifications, they'll appear here</p>
    </motion.div>
  )
}

export default NotificationsPage
