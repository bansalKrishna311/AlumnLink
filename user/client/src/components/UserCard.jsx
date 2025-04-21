import { Link } from "react-router-dom";

function UserCard({ user, isLink }) {
	return (
		<div className='bg-white rounded-lg shadow p-4 flex flex-col items-center transition-all hover:shadow-md'>
			<Link to={`/profile/${user.username}`} className='flex flex-col items-center'>
				<img
					src={user.profilePicture || "/avatar.png"}
					alt={user.name}
					className='w-24 h-24 rounded-full object-cover mb-4 border-2 border-[#fe6019]/20 hover:border-[#fe6019]/50 transition-colors'
				/>
				<h3 className='font-semibold text-lg text-center text-[#fe6019]'>{user.name}</h3>
			</Link>

			<p className='text-sm text-[#fe6019]/80 mt-2 font-medium'>{user.Links?.length} Links</p>
			<div className='w-full space-y-2 mt-4'>
				<button className='w-full bg-[#fe6019] text-white px-4 py-2 rounded-md hover:bg-[#fe6019]/90 transition-colors'>
					{isLink ? "Linked" : "Link"}
				</button>
				<Link 
					to={`/links/${user._id}`}
					className='block w-full text-center bg-white text-[#fe6019] border border-[#fe6019] px-4 py-2 rounded-md hover:bg-[#fe6019]/10 transition-colors'
				>
					Explore Networks
				</Link>
			</div>
		</div>
	);
}

export default UserCard;
