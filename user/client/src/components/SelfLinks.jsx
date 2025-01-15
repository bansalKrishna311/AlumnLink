import { useEffect, useState, useCallback } from "react";
import { Search, UserCircle2, MapPin, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { axiosInstance } from "@/lib/axios";

const SelfLinks = ({ onRemoveLink, onOpenUserAccount }) => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLinks, setFilteredLinks] = useState([]);

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
      onOpenUserAccount(username);
    },
    [onOpenUserAccount]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto shadow-lg">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex flex-col space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">My Alma Matters</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search Alma Matters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>
          </div>

          {/* Alma Matters List */}
          <ScrollArea className="h-[600px] pr-4">
            {filteredLinks.length > 0 ? (
              <div className="space-y-4">
                {filteredLinks.map((link) => (
                  <Card
                    key={link._id}
                    className="group hover:shadow-md transition-all duration-200 cursor-pointer"
                    onClick={() => handleOpenUserAccount(link.user.username)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className="relative">
                          {link.user.profilePicture ? (
                            <img
                              src={link.user.profilePicture}
                              alt={link.user.name || "Unknown User"}
                              className="w-14 h-14 rounded-full object-cover border-2 border-background"
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
                              <UserCircle2 className="w-8 h-8 text-muted-foreground" />
                            </div>
                          )}
                          {link.user.isOnline && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                          )}
                        </div>
                        
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-lg group-hover:text-primary transition-colors">
                              {link.user.name || "Unknown User"}
                            </h3>
                            <Badge variant="secondary" className="text-xs">
                              {link.connectionType || "Connection"}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground">
                            @{link.user.username || "unknown"}
                          </p>
                          
                          {link.user.location && (
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span>{link.user.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-muted/50">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <UserCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">
                    {searchQuery ? "No matches found" : "No Alma Matters yet"}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2 text-center max-w-sm">
                    {searchQuery
                      ? "Try adjusting your search terms or clearing the search."
                      : "Start connecting with other users to build your network."}
                  </p>
                </CardContent>
              </Card>
            )}
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default SelfLinks;