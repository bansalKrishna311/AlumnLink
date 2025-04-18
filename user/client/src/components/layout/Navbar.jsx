import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Home, LogOut, User, Users, Menu, Link2 } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "../Sidebar";
import SelfLinks from "../SelfLinks";

const Navbar = () => {
	const { data: authUser } = useQuery({ queryKey: ["authUser"] });
	const queryClient = useQueryClient();
	const navigate = useNavigate();
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

	// Handle showing SelfLinks as a stack screen instead of a sheet on mobile
	const handleSelfLinksClick = () => {
		if (window.innerWidth >= 1024) {
			// On large screens, do nothing special as the component is already visible
			return;
		}
		
		// On small screens, navigate to SelfLinks page instead of opening a sheet
		navigate('/my-links');
		
		// Close the sheet if it's open
		if (selfLinksOpen) {
			setSelfLinksOpen(false);
		}
	};

	return (
		<nav className='bg-secondary shadow-md sticky top-0 z-10'>
			<div className='max-w-7xl mx-auto px-4'>
				<div className='flex justify-between items-center py-3'>
					<div className='flex items-center space-x-4'>
						{authUser && (
							<Sheet open={sidebarOpen} onOpenChange={setSidebarOpen} className="lg:hidden">
								<SheetTrigger asChild>
									<button className="text-neutral flex flex-col items-center lg:hidden" aria-label="Menu">
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
								<Link to={"/"} className='text-neutral flex flex-col items-center'>
									<Home size={20} />
									<span className='text-xs hidden md:block'>Home</span>
								</Link>
								<Link to='/network' className='text-neutral flex flex-col items-center relative'>
									<Users size={20} />
									<span className='text-xs hidden md:block'>My Network</span>
									{unreadLinkRequestsCount > 0 && (
										<span
											className='absolute -top-1 -right-1 md:right-4 bg-blue-500 text-white text-xs 
										rounded-full size-3 md:size-4 flex items-center justify-center'
										>
											{unreadLinkRequestsCount}
										</span>
									)}
								</Link>
								<Link to='/notifications' className='text-neutral flex flex-col items-center relative'>
									<Bell size={20} />
									<span className='text-xs hidden md:block'>Notifications</span>
									{unreadNotificationCount > 0 && (
										<span
											className='absolute -top-1 -right-1 md:right-4 bg-blue-500 text-white text-xs 
										rounded-full size-3 md:size-4 flex items-center justify-center'
										>
											{unreadNotificationCount}
										</span>
									)}
								</Link>
								<Link
									to={`/profile/${authUser.username}`}
									className='text-neutral flex flex-col items-center'
								>
									<User size={20} />
									<span className='text-xs hidden md:block'>Me</span>
								</Link>


								{/* Keep Sheet for large screens for consistency */}
								<Sheet open={selfLinksOpen} onOpenChange={setSelfLinksOpen} className="hidden lg:block">
									<SheetTrigger asChild>
										<button className="text-neutral flex flex-col items-center" aria-label="My Alma Matters">
											<Link2 size={20} />
											<span className='text-xs hidden md:block'>Links</span>
										</button>
									</SheetTrigger>
									<SheetContent side="right" className="p-0 ">
										<div className="h-full overflow-auto">
											<SelfLinks />
										</div>
									</SheetContent>
								</Sheet>

								<button
									className='flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800'
									onClick={() => logout()}
								>
									<LogOut size={20} />
									<span className='hidden md:inline'>Logout</span>
								</button>
							</>
						) : (
							<>
								<Link to='/login' className='btn btn-ghost'>
									Sign In
								</Link>
								<Link to='/signup' className='btn btn-primary'>
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
