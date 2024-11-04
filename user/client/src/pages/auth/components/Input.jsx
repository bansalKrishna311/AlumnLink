const Input = ({ icon: Icon, ...props }) => {
	return (
		<div className='relative mb-6'>
			<div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
				<Icon className='size-5 text-[#DEA900]' />
			</div>
			<input
				{...props}
				className='pl-10 pr-3  bg-opacity-50  placeholder-gray-400 transition duration-200 input input-bordered w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FBD200]'
			/>
		</div>
	);
};

export default Input;