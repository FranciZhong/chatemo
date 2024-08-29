import { NotificationType } from '@/lib/constants';
import { NotificationZType } from '@/types/user';
import FriendRequestCard from '../FriendRequestCard';

interface Props {
	notification: NotificationZType;
}

const NotificationCard = ({ notification }: Props) => {
	switch (notification.type) {
		case NotificationType.FRIEND_REQUEST:
			return <FriendRequestCard notification={notification} />;
	}
};

export default NotificationCard;
