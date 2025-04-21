import { useEffect, useState, useCallback } from "react"; 
import { Search, UserCircle2, MapPin, Loader2, GraduationCap, ArrowRight, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { axiosInstance } from "@/lib/axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const SelfLinks = ({ onRemoveLink, onOpenUserAccount }) => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLinks, setFilteredLinks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await axiosInstance.get("/links");
        setLinks(response.data);
      } catch (error) {
        console.error("Error fetching links:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, []);

  useEffect(() => {
    const filtered = links.filter((link) =>
      link.user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredLinks(filtered);
  }, [searchQuery, links]);

  const handleOpenUserAccount = useCallback(
    (username) => {
      navigate(`/profile/${username}`);
    },
    [navigate]
  );

  const handleMessage = useCallback(
    (e, username) => {
      e.stopPropagation(); // Prevent card click event from firing

      // Check if the current user is a superadmin
      const currentUser = JSON.parse(localStorage.getItem('user')) || {};
      if (currentUser.role === 'superadmin') {
        // Prevent superadmin users from accessing messaging
        e.preventDefault();
        toast.error("Messaging is not available for superadmin accounts");
        return;
      }

      navigate(`/messages/${username}`); // Navigate to a specific user's chat
    },
    [navigate]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/20"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </div>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto shadow-xl sticky top-16 w-96 bg-gradient-to-b from-background to-background/95 backdrop-blur-sm border-opacity-50">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-6 w-6" style={{ color: '#fe6019' }} />
              <h2 className="text-2xl font-bold tracking-tight" style={{ background: 'linear-gradient(to right, #fe6019, rgba(254, 96, 25, 0.7))', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
                My Alma Matters
              </h2>
            </div>
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-hover:[&>*]:text-[#fe6019]" />
              <Input
                type="text"
                placeholder="Search Alma Matters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background/50 backdrop-blur-sm border-opacity-50 transition-all duration-300 focus:bg-background focus:shadow-lg focus:border-[#fe6019] focus:ring-[#fe6019]"
              />
            </div>
          </div>

          {/* Alma Matters List */}
          <ScrollArea className="max-h-[450px] pr-4">
            <AnimatePresence mode="popLayout">
              {filteredLinks.length > 0 ? (
                <div className="space-y-4">
                  {filteredLinks.map((link, index) => (
                    <motion.div
                      key={link._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card
                        className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
                        style={{ background: 'linear-gradient(to right, rgba(254, 96, 25, 0.05), transparent)' }}
                        onClick={() => navigate(`/profile/${link.user.username}`)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-4">
                            <div className="relative flex-shrink-0">
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                {link.user.profilePicture ? (
                                  <img
                                    src={link.user.profilePicture}
                                    alt={link.user.name || "Unknown User"}
                                    className="w-12 h-12 rounded-full object-cover border-2 border-background shadow-md"
                                  />
                                ) : (
                                  <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(to bottom right, rgba(254, 96, 25, 0.2), rgba(254, 96, 25, 0.1))' }}>
                                    <UserCircle2 className="w-10 h-10" style={{ color: 'rgba(254, 96, 25, 0.7)' }} />
                                  </div>
                                )}
                                {link.user.isOnline && (
                                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background shadow-sm" />
                                )}
                              </motion.div>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-md group-hover:text-[#fe6019] transition-colors break-words">
                                  {link.user.name || "Unknown User"}
                                </h3>
                              </div>

                              <div className="flex items-center justify-between mt-3">
                                <p className="text-sm text-muted-foreground/80 break-words font-medium">
                                  @{link.user.username || "unknown"}
                                </p>

                                {link.user.location && (
                                  <div className="flex items-center space-x-1.5 text-sm text-muted-foreground/80 px-2 py-0.5 rounded-full" style={{ background: 'rgba(254, 96, 25, 0.05)' }}>
                                    <MapPin className="h-3.5 w-3.5" style={{ color: 'rgba(254, 96, 25, 0.7)' }} />
                                    <span className="break-words">
                                      {link.user.location}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="mt-3 flex justify-between">
                            <button
                              className="flex items-center space-x-1 text-xs transition-colors bg-[#fe6019] text-white px-2 py-1 rounded-md hover:bg-[#e54e0e]"
                              onClick={(e) => handleMessage(e, link.user.username)}
                            >
                              <MessageCircle className="h-3.5 w-3.5" />
                              <span>Message</span>
                            </button>
                            
                            <button
                              className="flex items-center space-x-1 text-xs transition-colors"
                              style={{ color: 'rgba(254, 96, 25, 0.7)' }}
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/links/${link.user._id}`);
                              }}
                            >
                              <span>Explore Networks</span>
                              <ArrowRight className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="bg-gradient-to-br from-background" style={{ background: 'linear-gradient(to bottom right, transparent, rgba(254, 96, 25, 0.05))' }}>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <UserCircle2 className="h-12 w-12 mb-4" style={{ color: 'rgba(254, 96, 25, 0.5)' }} />
                      </motion.div>
                      <h3 className="text-lg font-semibold" style={{ background: 'linear-gradient(to right, #fe6019, rgba(254, 96, 25, 0.7))', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
                        {searchQuery ? "No matches found" : "No Alma Matters yet"}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-2 text-center max-w-sm">
                        {searchQuery
                          ? "Try adjusting your search terms or clearing the search."
                          : "Start connecting with other users to build your network."}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default SelfLinks;