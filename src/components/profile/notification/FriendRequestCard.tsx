import { toast } from '@/components/ui/use-toast';
import axiosInstance from '@/lib/axios';
import { ApiUrl, TOAST_ERROR_DEFAULT } from '@/lib/constants';
import useNotificationStore from '@/store/notificationStore';
import {
	AcceptRejectPayload,
	AcceptRejectStatusZType,
	FormatResponse,
} from '@/types/common';
import { NotificationZType } from '@/types/user';
import AcceptRejectCard from '../../AcceptRejectCard';
import UserCard from '../UserCard';

interface Props {
	notification: NotificationZType;
}

const FriendRequestCard: React.FC<Props> = ({ notification }) => {
	const { removeNotification } = useNotificationStore();

	const handleAccept = async (status: AcceptRejectStatusZType) => {
		try {
			await axiosInstance.post<FormatResponse<any>>(
				ApiUrl.RESPOND_FRIEND_REQUEST,
				{
					referToId: notification.referToId,
					status,
				} as AcceptRejectPayload
			);
			removeNotification(notification.referToId!);
		} catch (error) {
			toast(TOAST_ERROR_DEFAULT);
		}
	};

	return (
		<AcceptRejectCard
			onAccept={() => handleAccept('ACCEPTED')}
			onReject={() => handleAccept('REJECTED')}
		>
			<div className="flex flex-col gap-2">
				<div className="flex gap-2 items-end">
					<h3 className="font-bold">{notification.title}</h3>
					<span>from</span>
				</div>
				<UserCard user={notification.from!} />
				<p>{notification.description}</p>
			</div>
		</AcceptRejectCard>
	);
};

export default FriendRequestCard;
