'use client';

import { ImgUrl, PageUrl } from '@/lib/constants';
import useUserStore from '@/store/userStore';
import { ConversationZType } from '@/types/chat';
import LinkTab from './LinkTab';

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

	const friend = conversation
		.participants!.filter((participant) => participant.userId === friendId)
		.map((participant) => participant.user!)[0];

	const lastMessage = conversation.messages?.at(0);

	return (
		<LinkTab
			href={PageUrl.FRIENDS + '/' + conversation.id}
			image={friend.image || ImgUrl.USER_AVATAR_ALT}
			title={friend?.name || ' '}
			description={
				<p className="text-single-line text-sm text-foreground/60 font-light">
					{lastMessage?.content || lastMessage?.image || ' '}
				</p>
			}
		/>
	);
};

export default ConversationLink;
