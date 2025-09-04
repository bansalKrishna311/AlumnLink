import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Bell, Home, LogOut, User, Users, Menu, Link2, Hash, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "../Sidebar";
import SelfLinks from "../SelfLinks";
import { useAuthUser } from "@/hooks/useAppData";

const Navbar = () => {
	// Use optimized auth user from Zustand store
	const { data: authUser } = useAuthUser();
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const location = useLocation();
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [selfLinksOpen, setSelfLinksOpen] = useState(false);
	const [isSuperAdmin, setIsSuperAdmin] = useState(false);

	// Keep notifications query but optimize it with longer stale time
	const { data: notifications } = useQuery({
		queryKey: ["notifications"],
		queryFn: async () => axiosInstance.get("/notifications"),
		enabled: !!authUser,
		staleTime: 2 * 60 * 1000, // 2 minutes cache
		refetchInterval: 60000, // Reduce from default to 1 minute
	});

	// REMOVED: LinkRequests query as it's not needed anymore
	// This was causing unnecessary API calls shown in the network tab

	const { mutate: logout } = useMutation({
		mutationFn: () => axiosInstance.post("/auth/logout"),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
	});

	// Check if user is superadmin
	useEffect(() => {
		if (authUser) {
			setIsSuperAdmin(authUser.role === 'superadmin');
		}
	}, [authUser]);

	// Scroll to top when location changes
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [location.pathname]);

	const unreadNotificationCount = notifications?.data.filter((notif) => !notif.read).length;
	// REMOVED: unreadLinkRequestsCount as LinkRequests API call was unnecessary

	// Check current path to determine active page
	const isHomePage = location.pathname === "/";
	const isNetworkPage = location.pathname === "/network";
	const isNotificationsPage = location.pathname === "/notifications";
	const isProfilePage = location.pathname.startsWith("/profile/") && 
		(authUser && location.pathname.includes(authUser.username));
	const isTrendingHashtagsPage = location.pathname === "/trending-hashtags";
	const isMessagesPage = location.pathname.startsWith("/messages");

	// Redirect if superadmin tries to access messages page
	useEffect(() => {
		if (isSuperAdmin && isMessagesPage) {
			navigate('/');
		}
	}, [isSuperAdmin, isMessagesPage, navigate]);

	// Function to handle navigation and scroll to top
	const handleNavClick = () => {
		window.scrollTo(0, 0);
	};

	return (
		<nav className='bg-secondary shadow-md sticky top-0 z-10 transition-all duration-300 ease-in-out hover:shadow-lg'>
			<div className='max-w-7xl mx-auto px-4'>
				<div className='flex justify-between items-center py-3'>
					<div className='flex items-center space-x-4'>
						<Sheet open={sidebarOpen} onOpenChange={setSidebarOpen} className="lg:hidden">
							<SheetTrigger asChild>
								<button className="text-[#fe6019] flex flex-col items-center lg:hidden hover:text-[#fe6019] transition-all duration-200 hover:scale-110" aria-label="Menu">
									<Menu size={20} className="transform transition-transform duration-300 hover:rotate-90" />
									<span className='text-xs hidden md:block lg:hidden'>Menu</span>
								</button>
							</SheetTrigger>
							<SheetContent side="left" className="p-0 w-[280px]">
								<Sidebar user={authUser} />
							</SheetContent>
						</Sheet>
						<Link to='/' className="transform transition-transform duration-300 hover:scale-105" onClick={handleNavClick}>
							<img className='h-6+ sm:h-7 md:h-8 rounded hover:animate-none' src='/logo copy.png' alt='AlumnLink' />
						</Link>
					</div>
					<div className='flex items-center gap-2 md:gap-6'>
						<Link to={"/"} className='text-[#fe6019] flex flex-col items-center hover:text-[#fe6019] transition-all duration-300 hover:scale-110' onClick={handleNavClick}>
								<Home 
									size={20} 
									fill={isHomePage ? "#fe6019" : "none"} 
									className={`${isHomePage ? "font-bold" : ""} transform transition-transform duration-300 hover:rotate-12`}
								/>
								<span className={`text-xs text-black hidden md:block ${isHomePage ? "font-semibold" : ""} transition-all duration-300`}>Home</span>
						</Link>
						<Link to='/network' className='text-[#fe6019] flex flex-col items-center hover:text-[#fe6019] transition-all duration-300 hover:scale-110 relative' onClick={handleNavClick}>	
							<Users 
								size={20} 
								fill={isNetworkPage ? "#fe6019" : "none"}
								className={`${isNetworkPage ? "font-bold" : ""} transform transition-transform duration-300 hover:rotate-12`}
							/>
							<span className={`text-xs text-black hidden md:block ${isNetworkPage ? "font-semibold" : ""} transition-all duration-300`}>My Network</span>
							{/* REMOVED: Link requests badge as the API call was unnecessary */}
						</Link>						
						<Link to='/notifications' className='text-[#fe6019] flex flex-col items-center hover:text-[#fe6019] transition-all duration-300 hover:scale-110 relative' onClick={handleNavClick}>
							<Bell 
								size={20} 
								fill={isNotificationsPage ? "#fe6019" : "none"}
								className={`${isNotificationsPage ? "font-bold" : ""} transform transition-transform duration-300 hover:rotate-12`}
							/>
							<span className={`text-xs text-black hidden md:block ${isNotificationsPage ? "font-semibold" : ""} transition-all duration-300`}>Notifications</span>
							{unreadNotificationCount > 0 && (
								<span
									className='absolute -top-1 -right-1 md:right-4 bg-[#fe6019] text-white text-xs 
								rounded-full size-3 md:size-4 flex items-center justify-center font-medium
								animate-bounce'
								>
									{unreadNotificationCount}
								</span>
							)}
						</Link>
						
						{/* Only show messaging for non-superadmin users */}
						{!isSuperAdmin && (
							<Link to='/messages' className='text-[#fe6019] flex flex-col items-center hover:text-[#fe6019] transition-all duration-300 hover:scale-110 relative' onClick={handleNavClick}>
								<MessageSquare 
									size={20} 
									fill={isMessagesPage ? "#fe6019" : "none"}
									className={`${isMessagesPage ? "font-bold" : ""} transform transition-transform duration-300 hover:rotate-12`}
								/>
								<span className={`text-xs text-black hidden md:block ${isMessagesPage ? "font-semibold" : ""} transition-all duration-300`}>Messages</span>
							</Link>
						)}
						
						<Link
							to={`/profile/${authUser?.username || 'profile'}`}
							className='text-[#fe6019] flex flex-col items-center hover:text-[#fe6019] transition-all duration-300 hover:scale-110'
							onClick={handleNavClick}
						>
								<User 
									size={20} 
									fill={isProfilePage ? "#fe6019" : "none"}
									className={`${isProfilePage ? "font-bold" : ""} transform transition-transform duration-300 hover:rotate-12`}
								/>
								<span className={`text-xs text-black hidden md:block ${isProfilePage ? "font-semibold" : ""} transition-all duration-300`}>Me</span>
						</Link>

						{/* Link toggle visible only on smaller screens */}
						<Sheet open={selfLinksOpen} onOpenChange={setSelfLinksOpen}>
							<SheetTrigger asChild>
								<button className="text-[#fe6019] flex flex-col items-center lg:hidden group hover:text-[#fe6019] transition-all duration-300 hover:scale-110" aria-label="My Alma Matters">
									<div className="relative">
										<Link2 
											size={20} 
											className="transform rotate-[135deg] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[225deg]" 
										/>
									</div>
									<span className='text-xs hidden md:block lg:hidden'>Links</span>
								</button>
							</SheetTrigger>
							<SheetContent side="right" className="p-0 lg:hidden">
								<div className="h-full overflow-auto">
									<SelfLinks />
								</div>
							</SheetContent>
						</Sheet>

						<button
							className='flex flex-col items-center space-x-1 text-sm text-[#fe6019] hover:text-[#fe6019] transition-all duration-300 hover:scale-110'
							onClick={() => logout()}
						>
							<LogOut size={20} className="transform transition-transform duration-300 hover:rotate-12" />
							<span className='hidden md:inline text-black'>Logout</span>
						</button>
					</div>
				</div>
			</div>
		</nav>
	);
};
export default Navbar;
