const Input = ({ icon: Icon, ...props }) => {
	return (
		<div className='relative mb-6'>
			<div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
				<Icon className='size-5 text-[#DEB31C]' />
			</div>
			<input
				{...props}
				className='w-full pl-10 pr-3 py-3 rounded-lg border border-slate-500 text-slate-600 placeholder-gray-400 transition duration-500 '
			/>
		</div>
	);
};

export default Input;