import { motion } from "framer-motion";
import { useState } from "react";
import Input from "./components/Input";
import { ArrowLeft, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import Login from "../../../public/Login.png";
import icon from "../../../public/login-icon.webp";

const ForgotPasswordPage = () => {
	const [email, setEmail] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);

	const handleSubmit = (e) => {
		e.preventDefault();
		// Simulate form submission
		setIsSubmitted(true);
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

				{/* Right Side - Forgot Password Form */}
				<motion.div
					initial={{ opacity: 0, x: 50 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5 }}
					className="w-full lg:w-1/2 h-full flex items-center justify-center p-8 bg-opacity-50 backdrop-filter backdrop-blur-xl"
				>
					<div className="w-full lg:w-[26vw]">
						<div className="flex items-center mb-6 justify-center">
							<motion.img
								src={icon}
								alt="Waving Icon"
								className="w-10 me-2"
								animate={{
									rotate: [0, 15, 0, -15, 0],
									transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
								}}
								style={{ transformOrigin: "70% 70%" }}
							/>
							<h2 className="text-2xl font-medium text-center text-gray-800">
								Forgot Your Password?
							</h2>
						</div>

						{!isSubmitted ? (
							<form onSubmit={handleSubmit}>
								<p className="text-gray-500 mb-6 text-center">
									Enter your email address and we'll send you a link to reset your password.
								</p>
								<Input
									icon={Mail}
									type="email"
									placeholder="Email Address"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
								<motion.button
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									className="w-full py-3 px-4 bg-gradient-to-r from-[#6b21a8] to-[#440065] text-white font-bold rounded-lg shadow-lg hover:from-[#440065] hover:to-[#6b21a8] focus:outline-none focus:ring-2 focus:ring-[#6b21a8] focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
									type="submit"
								>
									Send Reset Link
								</motion.button>
							</form>
						) : (
							<div className="text-center">
								<motion.div
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									transition={{ type: "spring", stiffness: 500, damping: 30 }}
									className="w-16 h-16 bg-[#6b21a8] rounded-full flex items-center justify-center mx-auto mb-4"
								>
									<Mail className="h-8 w-8 text-white" />
								</motion.div>
								<p className="text-gray-500 mb-6">
									If an account exists for {email}, you will receive a password reset link shortly.
								</p>
							</div>
						)}
						<div className="flex items-center justify-center">
							<Link to="/login" className="text-sm text-[#6b21a8] hover:underline flex items-center">
								<ArrowLeft className="h-4 w-4 mr-2" /> Back to Login
							</Link>
						</div>
					</div>
				</motion.div>
			</div>
		</div>
	);
};

export default ForgotPasswordPage;
