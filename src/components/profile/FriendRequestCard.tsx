import { UserEvent } from '@/lib/events';
import useNotificationStore from '@/store/notificationStore';
import useSocketStore from '@/store/socketStore';
import { AcceptRejectPayload, AcceptRejectStatusZType } from '@/types/common';
import { NotificationZType } from '@/types/user';
import AcceptRejectCard from './AcceptRejectCard';
import UserCard from './UserCard';

interface Props {
	notification: NotificationZType;
}

const FriendRequestCard: React.FC<Props> = ({ notification }) => {
	const { socket } = useSocketStore();
	const { removeById } = useNotificationStore();

	const handleAccept = (status: AcceptRejectStatusZType) => {
		if (socket) {
			socket.emit(UserEvent.RESPOND_FRIEND_REQUEST, {
				referToId: notification.referToId,
				status,
			} as AcceptRejectPayload);
			removeById(notification.referToId!);
		}
	};

	return (
		<AcceptRejectCard
			onAccept={() => handleAccept('ACCEPTED')}
			onReject={() => handleAccept('REJECTED')}
		>
			<div className="flex flex-col gap-2">
				<div className="flex gap-2 items-end">
					<h3>{notification.title}</h3>
					<span>from</span>
				</div>
				<UserCard user={notification.from} />
				<p>{notification.description}</p>
			</div>
		</AcceptRejectCard>
	);
};

export default FriendRequestCard;
