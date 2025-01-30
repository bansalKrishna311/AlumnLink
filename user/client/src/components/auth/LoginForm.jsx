import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";
import { Link } from "react-router-dom";
import Login from '/Login.png';
import icon from '/login-icon.webp';

const LoginForm = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const queryClient = useQueryClient();

	const { mutate: loginMutation, isLoading } = useMutation({
		mutationFn: (userData) => axiosInstance.post("/auth/login", userData),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
		onError: (err) => {
			toast.error(err.response.data.message || "Something went wrong");
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		loginMutation({ username, password });
	};

	return (
		<div className="flex items-center justify-center h-full lg:h-[90vh] p-2 lg:ps-2 rounded-bl-[110px] rounded-tl-[10px] rounded-tr-[10px] rounded-br-[10px] shadow-lg bg-white">
			<div className="flex flex-col lg:flex-row w-full h-full max-w-6xl overflow-hidden">
				{/* Left Side - Image Section */}
				<div className="w-full lg:w-1/2 h-full hidden lg:block">
					<img
						src={Login}
						alt="Visual Representation"
						className="w-[26vw] h-full object-cover rounded-tl-[15px] rounded-tr-[100px] rounded-bl-[100px]"
					/>
				</div>

				{/* Right Side - Login Form */}
				<motion.div
					initial={{ opacity: 0, x: 50 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5 }}
					className="w-full lg:w-1/2 h-full flex items-center justify-center p-8 bg-opacity-50 backdrop-filter backdrop-blur-xl"
				>
					<div className="w-full lg:w-[26vw]">
						<div className="flex items-center mb-6 justify-center">
							<motion.img
								className="w-10 me-2"
								src={icon}
								alt="Hand waving"
								animate={{
									rotate: [0, 15, 0, -15, 0], // rotation angles
									transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }, // repeat animation
								}}
								style={{ transformOrigin: "70% 70%" }} // pivot point for waving effect
							/>
							<h2 className="text-2xl font-medium text-center text-gray-800">
								Welcome Back to AlumnLink!
							</h2>
						</div>

						{/* Form Section */}
						<form onSubmit={handleSubmit}>
							<div className="mb-4">
								<input
									type='text'
									placeholder='Username'
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									className='input input-bordered w-full'
									required
								/>
							</div>

							<div className="mb-6">
								<input
									type='password'
									placeholder='Password'
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className='input input-bordered w-full'
									required
								/>
							</div>

							<div className="flex items-center mb-6">
								<Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
									Forgot password?
								</Link>
							</div>

							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								className="w-full py-3 px-4 bg-[#DFDFDF] text-slate-600 font-bold rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-200"
								type="submit"
								disabled={isLoading}
							>
								{isLoading ? <Loader className="w-6 h-6 animate-spin mx-auto" /> : "Login"}
							</motion.button>
						</form>

						<div className="mt-6 text-center">
							<p className="text-md text-gray-600 border-2 border-opacity-20 p-3 rounded-full border-slate-500">
								Don't have an account?{" "}
								<Link to="/signup" className="text-blue-600 hover:underline">
									Sign up
								</Link>
							</p>
						</div>
					</div>
				</motion.div>
			</div>
		</div>
	);
};

export default LoginForm;
