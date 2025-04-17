export default function PostAction({ icon, text, onClick, isLiked, hasCommented }) {
	return (
		<button
			className={`${
				isLiked ? "text-[#fe6019]" : "text-gray-500"
			} hover:text-[#fe6019] transition-colors duration-200 flex items-center`}
			onClick={onClick}
		>
			<span className='mr-1'>{icon}</span>
			<span className='hidden sm:inline'>{text}</span>
		</button>
	);
}
