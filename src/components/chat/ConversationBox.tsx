'use client';

import axiosInstance from '@/lib/axios';
import {
	ApiUrl,
	PageUrl,
	TAKE_MESSAGES_DEFAULT,
	TOAST_ERROR_DEFAULT,
} from '@/lib/constants';
import { AgentEvent, ConversationEvent } from '@/lib/events';
import useAgentStore from '@/store/agentStore';
import useConversationStore from '@/store/conversationStore';
import useLlmModelStore from '@/store/llmModelStore';
import useSocketStore from '@/store/socketStore';
import {
	BasicConversationMessageZType,
	ConversationMessagePayload,
	ConversationMessageZType,
	MessagePayload,
	MessageZType,
} from '@/types/chat';
import { FormatResponse, IdPayload, SkipTakeQuery } from '@/types/common';
import { AgentReplyPayload } from '@/types/llm';
import { RocketIcon } from '@radix-ui/react-icons';
import { redirect } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import AgentHelpButton from '../AgentHelpButton';
import DeleteButton from '../DeleteButton';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { useToast } from '../ui/use-toast';
import ChatEditer from './ChatEditer';
import ChatMessageList from './ChatMessageList';

interface Props {
	conversationId: string;
}

const ConversationBox: React.FC<Props> = ({ conversationId }) => {
	const { conversations, pushMessages } = useConversationStore();
	const { agents } = useAgentStore();
	const { socket } = useSocketStore();
	const { toast } = useToast();
	const { selectedModel, setSelectedModel } = useLlmModelStore();
	const [moreMessages, setMoreMessages] = useState<boolean>(true);
	const [replyTo, setReplyTo] = useState<BasicConversationMessageZType | null>(
		null
	);

	const conversation = conversations.find(
		(item) => item.id === conversationId
	)!;

	if (!conversation) {
		redirect(PageUrl.CHAT);
	}

	const handleReplyTo = useCallback(
		(messageId: string) => {
			const matchedMessage =
				conversation.messages?.find((item) => item.id === messageId) || null;

			setReplyTo(matchedMessage);
		},
		[setReplyTo, conversation]
	);

	const deleteReplyTo = useCallback(() => setReplyTo(null), [setReplyTo]);

	const fetchMessages = useCallback(async () => {
		if (!moreMessages) {
			return;
		}

		try {
			const response = await axiosInstance.get<
				FormatResponse<ConversationMessageZType[]>
			>(ApiUrl.GET_CONVERSATION_MESSAGES, {
				params: {
					referToId: conversation.id,
					skip: conversation.messages?.length || 0,
					take: TAKE_MESSAGES_DEFAULT,
				} as SkipTakeQuery,
			});
			const messages = response.data.data;
			if (messages && messages?.length !== 0) {
				pushMessages(conversation.id, messages);
			} else {
				setMoreMessages(false);
			}
		} catch (error) {
			toast(TOAST_ERROR_DEFAULT);
		}
	}, [moreMessages, conversation, pushMessages, setMoreMessages, toast]);

	useEffect(() => {
		if (
			moreMessages &&
			(!conversation?.messages ||
				conversation.messages.length < TAKE_MESSAGES_DEFAULT)
		) {
			fetchMessages();
		}
	}, [conversation, moreMessages, fetchMessages]);

	const handleSubmit = useCallback(
		(payload: MessagePayload) => {
			const convPayload: ConversationMessagePayload = {
				...payload,
				conversationId,
			};
			socket?.emit(ConversationEvent.SEND_CONVERSATION_MESSAGE, convPayload);
		},
		[socket, conversationId]
	);

	const messageActions = useCallback(
		() => [
			(message: MessageZType) => (
				<DeleteButton
					key={`delete-message-${message.id}`}
					onDelete={() => {
						socket?.emit(ConversationEvent.DELETE_CONVERSATION_MESSAGE, {
							referToId: message.id,
						} as IdPayload);
					}}
				/>
			),
			(message: MessageZType) => (
				<Button
					key={`agent-none-${message.id}`}
					size="xs"
					variant="outline"
					onClick={() => {
						socket?.emit(AgentEvent.AGENT_REPLY_CONVERSATION, {
							replyTo: message.id,
							provider: selectedModel.provider,
							model: selectedModel.model,
						} as AgentReplyPayload);
					}}
				>
					<RocketIcon className="icon-size" />
				</Button>
			),
			...agents.map((agent) => {
				// todo fix here
				return function AgentHelpButtonComponent(message: MessageZType) {
					return (
						<AgentHelpButton
							key={`agent-help-button-${message.id}-${agent.id}`}
							agent={agent}
							onClick={() => {
								socket?.emit(AgentEvent.AGENT_REPLY_CONVERSATION, {
									replyTo: message.id,
									provider: selectedModel.provider,
									model: selectedModel.model,
									agentId: agent.id,
								} as AgentReplyPayload);
							}}
						/>
					);
				};
			}),
		],
		[selectedModel, socket, agents]
	);

	return (
		<div className="w-full h-full flex flex-col justify-end">
			<ChatMessageList
				participants={conversation.participants || []}
				messages={conversation.messages || []}
				onReplyTo={handleReplyTo}
				onScrollTop={fetchMessages}
				messageActions={messageActions}
				className="flex-1"
			/>
			<Separator orientation="horizontal" />
			<ChatEditer
				replyTo={replyTo}
				onDeleteReplyTo={deleteReplyTo}
				onSubmit={handleSubmit}
				selectedModel={selectedModel}
				onSelectedModelChange={setSelectedModel}
			/>
		</div>
	);
};

export default ConversationBox;
