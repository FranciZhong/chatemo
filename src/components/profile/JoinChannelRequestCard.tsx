import { ChannelEvent } from '@/lib/events';
import useNotificationStore from '@/store/notificationStore';
import useSocketStore from '@/store/socketStore';
import { AcceptRejectPayload, AcceptRejectStatusZType } from '@/types/common';
import { NotificationZType } from '@/types/user';
import AcceptRejectCard from './AcceptRejectCard';
import ChannelCard from './ChannelCard';
import UserCard from './UserCard';

interface Props {
	notification: NotificationZType;
}

const JoinChannelRequestCard: React.FC<Props> = ({ notification }) => {
	const { socket } = useSocketStore();
	const { removeNotification } = useNotificationStore();

	const handleAccept = (status: AcceptRejectStatusZType) => {
		if (socket) {
			socket.emit(ChannelEvent.RESPOND_JOIN_CHANNEL, {
				referToId: notification.referToId,
				status,
			} as AcceptRejectPayload);
			removeNotification(notification.referToId!);
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
				<UserCard user={notification.from!} />
				<p>{notification.description}</p>
			</div>
		</AcceptRejectCard>
	);
};

export default JoinChannelRequestCard;
