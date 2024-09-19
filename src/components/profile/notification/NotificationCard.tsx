import { NotificationType } from '@/lib/constants';
import { NotificationZType } from '@/types/user';
import FriendRequestCard from '../FriendRequestCard';
import JoinChannelRequestCard from '../JoinChannelRequestCard';

interface Props {
	notification: NotificationZType;
}

const NotificationCard = ({ notification }: Props) => {
	switch (notification.type) {
		case NotificationType.FRIEND_REQUEST:
			return <FriendRequestCard notification={notification} />;
		case NotificationType.JOIN_CHANNEL_REQUEST:
			return <JoinChannelRequestCard notification={notification} />;
	}
};

export default NotificationCard;
