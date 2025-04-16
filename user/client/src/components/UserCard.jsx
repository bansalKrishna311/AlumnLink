import { Link } from "react-router-dom";

function UserCard({ user, isLink }) {
	return (
		<div className='bg-white rounded-lg shadow p-4 flex flex-col items-center transition-all hover:shadow-md'>
			<Link to={`/profile/${user.username}`} className='flex flex-col items-center'>
				<img
					src={user.profilePicture || "/avatar.png"}
					alt={user.name}
					className='w-24 h-24 rounded-full object-cover mb-4'
				/>
				<h3 className='font-semibold text-lg text-center'>{user.name}</h3>
			</Link>
			<p className='text-gray-600 text-center'>{user.headline}</p>
			<p className='text-sm text-gray-500 mt-2'>{user.Links?.length} Links</p>
z			<div className='w-full space-y-2 mt-4'>
				<button className='w-full bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors'>
					{isLink ? "Linked" : "Link"}
				</button>
				<Link 
					to={`/links/${user._id}`}
					className='block w-full text-center bg-white text-primary border border-primary px-4 py-2 rounded-md hover:bg-primary hover:text-white transition-colors'
				>
					Explore Networks
				</Link>
			</div>
		</div>
	);
}

export default UserCard;
