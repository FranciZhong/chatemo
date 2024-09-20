import { NotificationType } from '@/lib/constants';
import { NotificationZType } from '@/types/user';
import ChannelRequestCard from './ChannelRequestCard';
import FriendRequestCard from './FriendRequestCard';

interface Props {
	notification: NotificationZType;
}

const NotificationCard = ({ notification }: Props) => {
	switch (notification.type) {
		case NotificationType.FRIEND_REQUEST:
			return <FriendRequestCard notification={notification} />;
		case NotificationType.JOIN_CHANNEL_REQUEST:
			return <ChannelRequestCard notification={notification} />;
		case NotificationType.INVITE_CHANNEL_REQUEST:
			return <ChannelRequestCard notification={notification} />;
	}
};

export default NotificationCard;
