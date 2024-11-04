import { motion } from "framer-motion";
import { useState } from "react";
import Input from "./components/Input";
import { ArrowLeft, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import Login from "../../../public/Login.png";
import icon from "../../../public/login-icon.webp";
import axios from "axios";

const ForgotPasswordPage = () => {
	const [email, setEmail] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await axios.post("http://localhost:5000/api/v1/auth/forgot-password", { email });
			setIsSubmitted(true);
		} catch (error) {
			console.error("Error submitting email:", error);
			alert("Error sending password reset email");
		}
	};

	return (
		<div className="flex items-center justify-center h-screen p-4 lg:p-0 bg-gray-100">
			<div className="flex flex-col lg:flex-row w-full h-full max-w-4xl rounded-xl shadow-lg bg-white overflow-hidden">
				<div className="relative w-full lg:w-1/2 h-64 lg:h-full">
					<img src={Login} alt="Visual Representation" className="w-full h-full object-cover" />
					<div className="absolute inset-0 bg-black opacity-30"></div>
				</div>

				<motion.div
					initial={{ opacity: 0, x: 50 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5 }}
					className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-gray-50"
				>
					<div className="w-full max-w-sm">
						<div className="flex items-center mb-6 justify-center">
							<motion.img
								src={icon}
								alt="Waving Icon"
								className="w-10 mr-2"
								animate={{
									rotate: [0, 15, 0, -15, 0],
									transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
								}}
								style={{ transformOrigin: "70% 70%" }}
							/>
							<h2 className="text-2xl font-semibold text-gray-800">
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
									className="w-full py-3 px-4 mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:from-indigo-600 hover:to-purple-600 transition duration-200"
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
									className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4"
								>
									<Mail className="h-8 w-8 text-white" />
								</motion.div>
								<p className="text-gray-500 mb-6">
									If an account exists for {email}, you will receive a password reset link shortly.
								</p>
							</div>
						)}
						<div className="flex items-center justify-center mt-4">
							<Link to="/login" className="text-sm text-purple-600 hover:underline flex items-center">
								<ArrowLeft className="h-4 w-4 mr-1" /> Back to Login
							</Link>
						</div>
					</div>
				</motion.div>
			</div>
		</div>
	);
};

export default ForgotPasswordPage;
