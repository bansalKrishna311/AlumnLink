import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader } from "lucide-react"; // Import Loader for loading state
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";
import Login from '../../assets/Login.png'; // Import the login image
import icon from '../../assets/login-icon.webp'; // Add your icon here

const EmailVerificationPage = () => {
	const [code, setCode] = useState(["", "", "", "", "", ""]);
	const inputRefs = useRef([]);
	const navigate = useNavigate();

	const { error, isLoading, verifyEmail } = useAuthStore();

	const handleChange = (index, value) => {
		const newCode = [...code];

		// Handle pasted content
		if (value.length > 1) {
			const pastedCode = value.slice(0, 6).split("");
			for (let i = 0; i < 6; i++) {
				newCode[i] = pastedCode[i] || "";
			}
			setCode(newCode);
			const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
			const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
			inputRefs.current[focusIndex].focus();
		} else {
			newCode[index] = value;
			setCode(newCode);
			if (value && index < 5) {
				inputRefs.current[index + 1].focus();
			}
		}
	};

	const handleKeyDown = (index, e) => {
		if (e.key === "Backspace" && !code[index] && index > 0) {
			inputRefs.current[index - 1].focus();
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const verificationCode = code.join("");
		try {
			await verifyEmail(verificationCode);
			navigate("/");
			toast.success("Email verified successfully");
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		if (code.every((digit) => digit !== "")) {
			handleSubmit(new Event("submit"));
		}
	}, [code]);

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

				{/* Right Side - Verification Form */}
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
								alt="Verification Icon"
								animate={{
									rotate: [0, 15, 0, -15, 0], // Add waving effect
									transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
								}}
								style={{ transformOrigin: "70% 70%" }} // Adjust pivot point for waving effect
							/>
							<h2 className="text-2xl font-medium text-center text-gray-800">
								Verify Your Email
							</h2>
						</div>
						<p className="text-center text-gray-600 mb-6">
							Enter the 6-digit code sent to your email address.
						</p>

						<form onSubmit={handleSubmit} className="space-y-6">
							<div className="flex justify-between mb-4">
								{code.map((digit, index) => (
									<input
										key={index}
										ref={(el) => (inputRefs.current[index] = el)}
										type="text"
										maxLength="1" // Allow only a single character input
										value={digit}
										onChange={(e) => handleChange(index, e.target.value)}
										onKeyDown={(e) => handleKeyDown(index, e)}
										className="w-12 h-12 text-center text-2xl font-bold bg-[#DFDFDF] text-slate-600 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
									/>
								))}
							</div>
							{error && <p className="text-red-500 font-semibold mb-2">{error}</p>}

							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								type="submit"
								disabled={isLoading || code.some((digit) => !digit)}
								className="w-full py-3 px-4 bg-[#DFDFDF] text-slate-600 font-bold rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-200"
							>
								{isLoading ? <Loader className="w-6 h-6 animate-spin mx-auto" /> : "Verify Email"}
							</motion.button>
						</form>
					</div>
				</motion.div>
			</div>
		</div>
	);
};

export default EmailVerificationPage;
