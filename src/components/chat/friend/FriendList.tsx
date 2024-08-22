'use client';

import IconToggle from '@/components/IconToggle';
import { Input } from '@/components/ui/input';
import { PlusIcon } from '@radix-ui/react-icons';
import FriendTab from './FriendTab';

interface Props {}

const FriendList: React.FC<Props> = ({}) => {
	return (
		<div className="flex flex-col">
			<div className="flex justify-end items-center gap-2 px-4">
				<Input />
				<IconToggle onClick={() => {}}>
					<PlusIcon />
				</IconToggle>
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
