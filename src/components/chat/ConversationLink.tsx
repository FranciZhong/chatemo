'use client';

import ItemContainer from '@/components/ItemContainer';
import { AvatarSize, ImgUrl, PageUrl } from '@/lib/constants';
import { cn, getAvatarSizeStyle } from '@/lib/utils';
import useUserStore from '@/store/userStore';
import { ConversationZType } from '@/types/chat';
import Link from 'next/link';
import { Avatar, AvatarImage } from '../ui/avatar';

interface Props {
	conversation: ConversationZType;
}

const ConversationLink: React.FC<Props> = ({ conversation }) => {
	const { user } = useUserStore();

	// only support direct messages now
	if (conversation.type !== 'DIRECT' || !conversation.friendships) {
		return null;
	}

	const friendId = conversation.friendships
		.filter((friendship) => friendship.userId === user?.id)
		.map((friendship) => friendship.friendId)
		.at(0);

	const friend = conversation.participants
		.filter((participant) => participant.userId === friendId)
		.map((participant) => participant.user!)[0];

	return (
		<Link href={PageUrl.FRIENDS + '/' + conversation.id}>
			<ItemContainer className="p-2 w-full h-16 hover:cursor-pointer">
				<div className="w-full h-full flex gap-2 items-center">
					<Avatar
						className={cn('bg-secondary', getAvatarSizeStyle(AvatarSize.MD))}
					>
						<AvatarImage src={friend.image || ImgUrl.USER_AVATAR_ALT} />
					</Avatar>
					<div className="w-60">
						<h5 className="font-semibold text-single-line">{friend?.name}</h5>
						<p className="text-single-line text-sm text-foreground/60 font-light">
							Hello!! How are you going? Hello!! How are you going?
						</p>
					</div>
				</div>
			</ItemContainer>
		</Link>
	);
};

export default ConversationLink;
