import SearchUserBox from '@/components/SearchUserBox';
import { useToast } from '@/components/ui/use-toast';
import axiosInstance from '@/lib/axios';
import { ApiUrl, NavModalTab } from '@/lib/constants';
import { FormatResponse, IdPayload } from '@/types/common';

const FindFriendBox: React.FC = () => {
	const { toast } = useToast();

	const handleSendRequest = (referToId: string) => async () => {
		// todo if use dialog for description
		try {
			await axiosInstance.post<FormatResponse<any>>(
				ApiUrl.SEND_FRIEND_REQUEST,
				{ referToId } as IdPayload
			);
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Something went wrong.',
			});
		}
	};

	return (
		<div className="w-full flex flex-col gap-4">
			<h2 className="heading">{NavModalTab.FIND_FRIEND.toLocaleUpperCase()}</h2>
			<p className="text-md text-muted-foreground">
				You can add friends with their username on Chatemo.
			</p>

			<div className="flex-1">
				<SearchUserBox
					placeholder="Type a friend name starting with..."
					handleSendRequest={handleSendRequest}
				/>
			</div>
		</div>
	);
};

export default FindFriendBox;
