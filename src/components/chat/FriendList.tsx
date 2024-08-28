'use client';

import IconButton from '@/components/IconButton';
import { Input } from '@/components/ui/input';
import { PlusIcon } from '@radix-ui/react-icons';
import { useToast } from '../ui/use-toast';
import FriendTab from './FriendTab';

interface Props {}

const FriendList: React.FC<Props> = ({}) => {
	const { toast } = useToast();

	return (
		<div className="flex flex-col">
			<div className="flex justify-end items-center gap-2 px-4">
				<Input />
				<IconButton
					onClick={() => {
						toast({ title: 'Hi' });
					}}
				>
					<PlusIcon className="icon-size" />
				</IconButton>
			</div>
			<div className="p-2 w-full h-full flex flex-col gap-1">
				<FriendTab />
				<FriendTab />
				<FriendTab />
				<FriendTab />
				<FriendTab />
				<FriendTab />
				<FriendTab />
				<FriendTab />
				<FriendTab />
				<FriendTab />
				<FriendTab />
				<FriendTab />
				<FriendTab />
				<FriendTab />
				<FriendTab />
				<FriendTab />
				<FriendTab />
				<FriendTab />
				<FriendTab />
				<FriendTab />
				<FriendTab />
				<FriendTab />
				<FriendTab />
				<FriendTab />
				<FriendTab />
			</div>
		</div>
	);
};

export default FriendList;
