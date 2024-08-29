'use client';

import ItemContainer from '@/components/ItemContainer';
import { ImgUrl } from '@/lib/constants';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';

interface Props {}

const FriendTab: React.FC<Props> = ({}) => {
	return (
		<ItemContainer className="px-2 h-14 w-full flex gap-2 items-center hover:cursor-pointer">
			<Avatar className="h-10 w-10 rounded-full bg-secondary">
				<AvatarImage className="rounded-full" src={ImgUrl.USER_AVATAR_ALT} />
			</Avatar>
			<div className="flex flex-col">
				<div className="text-lg font-semibold">username</div>
				<div className="text-sm font-light">Hello!! How are you going?</div>
			</div>
		</ItemContainer>
	);
};

export default FriendTab;
