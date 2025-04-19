import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Bell, Home, LogOut, User, Users, Menu, Link2 } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "../Sidebar";
import SelfLinks from "../SelfLinks";

const Navbar = () => {
	const { data: authUser } = useQuery({ queryKey: ["authUser"] });
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const location = useLocation();
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [selfLinksOpen, setSelfLinksOpen] = useState(false);

	const { data: notifications } = useQuery({
		queryKey: ["notifications"],
		queryFn: async () => axiosInstance.get("/notifications"),
		enabled: !!authUser,
	});

	const { data: LinkRequests } = useQuery({
		queryKey: ["LinkRequests"],
		queryFn: async () => axiosInstance.get("/Links/requests"),
		enabled: !!authUser,
	});

	const { mutate: logout } = useMutation({
		mutationFn: () => axiosInstance.post("/auth/logout"),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
	});

	const unreadNotificationCount = notifications?.data.filter((notif) => !notif.read).length;
	const unreadLinkRequestsCount = LinkRequests?.data?.length;

	// Check current path to determine active page
	const isHomePage = location.pathname === "/";
	const isNetworkPage = location.pathname === "/network";
	const isNotificationsPage = location.pathname === "/notifications";
	const isProfilePage = location.pathname.startsWith("/profile/") && 
		(authUser && location.pathname.includes(authUser.username));

	return (
		<nav className='bg-secondary shadow-md sticky top-0 z-10'>
			<div className='max-w-7xl mx-auto px-4'>
				<div className='flex justify-between items-center py-3'>
					<div className='flex items-center space-x-4'>
						{authUser && (
							<Sheet open={sidebarOpen} onOpenChange={setSidebarOpen} className="lg:hidden">
								<SheetTrigger asChild>
									<button className="text-[#fe6019] flex flex-col items-center lg:hidden hover:text-[#fe6019]/80 transition-colors" aria-label="Menu">
										<Menu size={20} />
										<span className='text-xs hidden md:block lg:hidden'>Menu</span>
									</button>
								</SheetTrigger>
								<SheetContent side="left" className="p-0 w-[280px]">
									<Sidebar user={authUser} />
								</SheetContent>
							</Sheet>
						)}
						<Link to='/'>
							<img className='h-8 rounded' src='/logo copy.png' alt='AlumnLink' />
						</Link>
					</div>
					<div className='flex items-center gap-2 md:gap-6'>
						{authUser ? (
							<>
								<Link to={"/"} className='text-[#fe6019] flex flex-col items-center hover:text-[#fe6019]/80 transition-colors'>
										<Home 
											size={20} 
											fill={isHomePage ? "#fe6019" : "none"} 
											className={isHomePage ? "font-bold" : ""}
										/>
										<span className={`text-xs text-black hidden md:block ${isHomePage ? "font-semibold" : ""}`}>Home</span>
								</Link>
								<Link to='/network' className='text-[#fe6019] flex flex-col items-center hover:text-[#fe6019]/80 transition-colors relative'>
									<Users 
										size={20} 
										fill={isNetworkPage ? "#fe6019" : "none"}
										className={isNetworkPage ? "font-bold" : ""}
									/>
									<span className={`text-xs text-black hidden md:block ${isNetworkPage ? "font-semibold" : ""}`}>My Network</span>
									{unreadLinkRequestsCount > 0 && (
										<span
											className='absolute -top-1 -right-1 md:right-4 bg-[#fe6019] text-white text-xs 
										rounded-full size-3 md:size-4 flex items-center justify-center font-medium'
										>
											{unreadLinkRequestsCount}
										</span>
									)}
								</Link>
								<Link to='/notifications' className='text-[#fe6019] flex flex-col items-center hover:text-[#fe6019]/80 transition-colors relative'>
									<Bell 
										size={20} 
										fill={isNotificationsPage ? "#fe6019" : "none"}
										className={isNotificationsPage ? "font-bold" : ""}
									/>
									<span className={`text-xs text-black hidden md:block ${isNotificationsPage ? "font-semibold" : ""}`}>Notifications</span>
									{unreadNotificationCount > 0 && (
										<span
											className='absolute -top-1 -right-1 md:right-4 bg-[#fe6019] text-white text-xs 
										rounded-full size-3 md:size-4 flex items-center justify-center font-medium'
										>
											{unreadNotificationCount}
										</span>
									)}
								</Link>
								<Link
									to={`/profile/${authUser.username}`}
									className='text-[#fe6019] flex flex-col items-center hover:text-[#fe6019]/80 transition-colors'
								>
										<User 
											size={20} 
											fill={isProfilePage ? "#fe6019" : "none"}
											className={isProfilePage ? "font-bold" : ""}
										/>
										<span className={`text-xs text-black hidden md:block ${isProfilePage ? "font-semibold" : ""}`}>Me</span>
								</Link>

								{/* Link toggle visible only on smaller screens */}
								<Sheet open={selfLinksOpen} onOpenChange={setSelfLinksOpen}>
									<SheetTrigger asChild>
										<button className="text-[#fe6019] flex flex-col items-center lg:hidden group hover:text-[#fe6019]/80 transition-colors" aria-label="My Alma Matters">
											<div className="relative">
												<Link2 
													size={20} 
													className="transform rotate-[135deg] transition-transform duration-300 group-hover:scale-105" 
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
									className='flex items-center space-x-1 text-sm text-[#fe6019] hover:text-[#fe6019]/80 transition-colors'
									onClick={() => logout()}
								>
									<LogOut size={20} />
									<span className='hidden md:inline text-black'>Logout</span>
								</button>
							</>
						) : (
							<>
								<Link to='/login' className='btn btn-ghost text-[#fe6019]'>
									Sign In
								</Link>
								<Link to='/signup' className='btn btn-primary bg-[#fe6019] hover:bg-[#fe6019]/90 border-[#fe6019]'>
									Join now
								</Link>
							</>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
};
export default Navbar;
