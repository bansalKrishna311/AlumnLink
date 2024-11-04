const Input = ({ icon: Icon, ...props }) => {
	return (
		<div className='relative mb-6'>
			<div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
				<Icon className='size-5 text-[#6b21a8]' />
			</div>
			<input
				{...props}
				className='w-full pl-10 pr-3 py-2 bg-[#3f0a40] bg-opacity-50 rounded-lg border border-[#440065] focus:border-[#6b21a8] focus:ring-2 focus:ring-[#6b21a8] text-white placeholder-gray-400 transition duration-200'
			/>
		</div>
	);
};

export default Input;