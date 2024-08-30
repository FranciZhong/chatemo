import axiosInstance from '@/lib/axios';
import { ApiUrl } from '@/lib/constants';
import { FormatResponse } from '@/types/common';
import { UserZType } from '@/types/user';
import { PlusIcon } from '@radix-ui/react-icons';
import IconButton from '../IconButton';
import UserCard from './UserCard';

interface Props {
	user: UserZType;
}

const SearchUserCard: React.FC<Props> = ({ user }) => {
	const handleAddFriend = async () => {
		// todo if use dialog for description
		// todo socket.io for notifications
		try {
			await axiosInstance.post<FormatResponse<any>>(
				ApiUrl.SEND_FRIEND_REQUEST,
				{ receiverId: user.id }
			);
		} catch (error) {}
	};

	return (
		<div className="w-full p-4 rounded-lg border-[1px] border-border flex gap-2 items-center justify-end">
			<div className="flex-1">
				<UserCard user={user} />
			</div>
			<IconButton onClick={handleAddFriend}>
				<PlusIcon className="icon-size" />
			</IconButton>
		</div>
	);
};

export default SearchUserCard;
