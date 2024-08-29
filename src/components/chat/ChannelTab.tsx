'use client';

import ItemContainer from '@/components/ItemContainer';
import { Badge } from '@/components/ui/badge';
import { ImgUrl } from '@/lib/constants';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';

interface Props {}

const ChannelTab: React.FC<Props> = ({}) => {
	return (
		<ItemContainer className="px-2 h-14 w-full flex gap-2 items-center hover:cursor-pointe">
			<Avatar className="h-10 w-10 rounded-full bg-secondary">
				<AvatarImage className="rounded-full" src={ImgUrl.CHANNEL_AVATAR_ALT} />
			</Avatar>
			<div className="flex flex-col">
				<div>channel name</div>
				<div className="flex items-center gap-1">
					<Badge>private</Badge>
				</div>
			</div>
		</ItemContainer>
	);
};

export default ChannelTab;
