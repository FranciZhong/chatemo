'use client';

import axiosInstance from '@/lib/axios';
import { ApiUrl, TAKE_MESSAGES_DEFAULT } from '@/lib/constants';
import { ChatEvent } from '@/lib/events';
import useConversationStore from '@/store/conversationStore';
import useSocketStore from '@/store/socketStore';
import {
	BasicConversationMessageZType,
	ConversationMessagePayload,
	ConversationMessageZType,
	ConversationZType,
	MessagePayload,
} from '@/types/chat';
import { FormatResponse } from '@/types/common';
import { useCallback, useEffect, useState } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { useToast } from '../ui/use-toast';
import ChatEditer from './ChatEditer';
import ChatMessageList from './ChatMessageList';

interface Props {
	initConversation: ConversationZType;
}

const ConversationBox: React.FC<Props> = ({ initConversation }) => {
	const { conversations, updateConversation } = useConversationStore();
	const { socket } = useSocketStore();
	const { toast } = useToast();

	const conversation = conversations.find(
		(item) => item.id === initConversation.id
	)!;

	const [replyTo, setReplyTo] = useState<BasicConversationMessageZType | null>(
		null
	);

	const handleReplyTo = useCallback(
		(messageId: string) => {
			const matchedMessage =
				conversation.messages?.find((item) => item.id === messageId) || null;

			setReplyTo(matchedMessage);
		},
		[setReplyTo, conversation]
	);

	const deleteReplyTo = useCallback(() => setReplyTo(null), [setReplyTo]);

	useEffect(() => {
		const updateConversationMessages = async () => {
			if (!conversation?.messages) {
				try {
					const response = await axiosInstance.get<
						FormatResponse<ConversationMessageZType[]>
					>(ApiUrl.GET_CONVERSATION_MESSAGES, {
						params: {
							conversationId: initConversation.id,
							skip: 0,
							take: TAKE_MESSAGES_DEFAULT,
						},
					});
					const messages = response.data.data;
					initConversation.messages = messages;
				} catch (error) {
					toast({
						title: 'Error',
						description: 'Something went wrong.',
					});
				}
			}

			updateConversation(initConversation);
		};

		updateConversationMessages();
	}, [initConversation]);

	const handleSubmit = useCallback(
		(payload: MessagePayload) => {
			const convPayload: ConversationMessagePayload = {
				...payload,
				conversationId: initConversation.id,
			};
			socket?.emit(ChatEvent.SEND_CONVERSATION_MESSAGE, convPayload);
		},
		[socket]
	);

	return (
		<div className="w-full h-full flex flex-col justify-end">
			<div className="flex-1 overflow-hidden">
				<ScrollArea className="w-full h-full">
					<ChatMessageList
						participants={conversation.participants}
						messages={conversation.messages || []}
						onReplyTo={handleReplyTo}
					/>
				</ScrollArea>
			</div>
			<Separator orientation="horizontal" />
			<ChatEditer
				replyTo={replyTo}
				onDeleteReplyTo={deleteReplyTo}
				onSubmit={handleSubmit}
			/>
		</div>
	);
};

export default ConversationBox;
