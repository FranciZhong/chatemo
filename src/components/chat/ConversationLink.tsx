'use client';

import axiosInstance from '@/lib/axios';
import { ApiUrl, ImgUrl, PageUrl, TOAST_ERROR_DEFAULT } from '@/lib/constants';
import useUserStore from '@/store/userStore';
import { ConversationZType } from '@/types/chat';
import { FormatResponse, IdPayload } from '@/types/common';
import { useCallback, useRef } from 'react';
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from '../ui/context-menu';
import { toast } from '../ui/use-toast';
import WarningTrigger from '../WarningTrigger';
import LinkTab from './LinkTab';

interface Props {
	conversation: ConversationZType;
}

const ConversationLink: React.FC<Props> = ({ conversation }) => {
	const { user } = useUserStore();
	const deleteWarningRef = useRef<HTMLDivElement | null>(null);

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

	const handleDelete = useCallback(async () => {
		if (conversation.type === 'DIRECT') {
			const friendship = conversation.friendships?.find(
				(item) => item.userId === user?.id
			);
			if (!friendship) {
				console.error('No friendship matched');
				return;
			}
			try {
				await axiosInstance.post<FormatResponse<any>>(
					ApiUrl.DELETE_FRIENDSHIP,
					{
						referToId: friendship.id,
					} as IdPayload
				);
			} catch (error) {
				toast(TOAST_ERROR_DEFAULT);
			}
		}
	}, [conversation]);

	return (
		<div>
			<ContextMenu>
				<ContextMenuTrigger>
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
				</ContextMenuTrigger>
				<ContextMenuContent>
					<ContextMenuItem
						onClick={() => deleteWarningRef.current?.click()}
						className="focus:bg-accent"
					>
						Disconnect
					</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenu>
			<WarningTrigger onContinue={handleDelete}>
				<div ref={deleteWarningRef} />
			</WarningTrigger>
		</div>
	);
};

export default ConversationLink;
