import { Card } from '@/components/ui/card';
import { NotificationZType } from '@/types/user';
import { CheckIcon, Cross2Icon } from '@radix-ui/react-icons';
import IconButton from '../IconButton';
import UserCard from './UserCard';

interface Props {
	notification: NotificationZType;
}

const NotificationCard = ({ notification }: Props) => {
	return (
		<Card className="w-full min-h-24 px-4 py-2 flex gap-2 items-center justify-end">
			<div className="flex-1 flex flex-col gap-2">
				<div className="flex gap-2 items-end">
					<h3>{notification.title}</h3>
					<span>from</span>
				</div>
				<UserCard user={notification.from} />
				<p>{notification.description}</p>
			</div>

			<div className="flex items-center gap-2 justify-between">
				<IconButton className="hover:bg-secondary">
					<CheckIcon className="icon-size" />
				</IconButton>
				<IconButton className="hover:bg-accent">
					<Cross2Icon className="icon-size" />
				</IconButton>
			</div>
		</Card>
	);
};

export default NotificationCard;
