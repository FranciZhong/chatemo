import { toast } from '@/components/ui/use-toast';
import axiosInstance from '@/lib/axios';
import { ApiUrl, AvatarSize, TOAST_ERROR_DEFAULT } from '@/lib/constants';
import useNotificationStore from '@/store/notificationStore';
import {
	AcceptRejectPayload,
	AcceptRejectStatusZType,
	FormatResponse,
} from '@/types/common';
import { NotificationZType } from '@/types/user';
import AcceptRejectCard from '../../AcceptRejectCard';
import ChannelCard from '../ChannelCard';
import UserCard from '../UserCard';

interface Props {
	notification: NotificationZType;
}

const ChannelRequestCard: React.FC<Props> = ({ notification }) => {
	const { removeNotification } = useNotificationStore();

	const handleAccept = async (status: AcceptRejectStatusZType) => {
		try {
			await axiosInstance.post<FormatResponse<any>>(
				ApiUrl.CHANNEL_RESPOND_REQUEST,
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

	console.log(notification);

	return (
		<AcceptRejectCard
			onAccept={() => handleAccept('ACCEPTED')}
			onReject={() => handleAccept('REJECTED')}
		>
			<div className="flex flex-col gap-2">
				<h3 className="font-bold">{notification.title}</h3>
				{notification.referTo?.channel && (
					<ChannelCard channel={notification.referTo?.channel} />
				)}
				<div className="flex items-center gap-2">
					<span>From</span>
					<UserCard size={AvatarSize.XS} user={notification.from!} />
				</div>
				<p>{notification.description}</p>
			</div>
		</AcceptRejectCard>
	);
};

export default ChannelRequestCard;
