'use client';

import axiosInstance from '@/lib/axios';
import {
	ApiUrl,
	AvatarSize,
	ImgUrl,
	LlmProviderName,
	TAKE_MESSAGES_DEFAULT,
} from '@/lib/constants';
import { AgentEvent, ChatEvent } from '@/lib/events';
import { cn, getAvatarSizeStyle } from '@/lib/utils';
import useAgentStore from '@/store/agentStore';
import useConversationStore from '@/store/conversationStore';
import useSocketStore from '@/store/socketStore';
import {
	BasicConversationMessageZType,
	ConversationMessagePayload,
	ConversationMessageZType,
	ConversationZType,
	MessagePayload,
	MessageZType,
} from '@/types/chat';
import { FormatResponse } from '@/types/common';
import { AgentReplyPayload, LlmModelZType } from '@/types/llm';
import { RocketIcon } from '@radix-ui/react-icons';
import { useCallback, useEffect, useState } from 'react';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
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
	const { agents } = useAgentStore();
	const { socket } = useSocketStore();
	const { toast } = useToast();
	const [selectedModel, setSelectedModel] = useState<LlmModelZType>({
		provider: LlmProviderName.OPENAI,
		model: 'gpt-4o-mini',
	});

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
					updateConversation(initConversation);
				} catch (error) {
					toast({
						title: 'Error',
						description: 'Something went wrong.',
					});
				}
			}
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

	const messageActions = useCallback(
		() => [
			(message: MessageZType) => (
				<Button
					key={'agent-none'}
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
			...agents.map((agent) => (message: MessageZType) => (
				<Button
					key={'agent-' + agent.id}
					size="xs"
					variant="outline"
					onClick={() => {
						socket?.emit(AgentEvent.AGENT_REPLY_CONVERSATION, {
							replyTo: message.id,
							provider: selectedModel.provider,
							model: selectedModel.model,
							agentId: agent.id,
						} as AgentReplyPayload);
					}}
				>
					<div className="flex gap-2 items-center">
						<Avatar
							className={cn('bg-secondary', getAvatarSizeStyle(AvatarSize.XS))}
						>
							<AvatarImage src={agent.image || ImgUrl.AGENT_AVATAR_ALT} />
						</Avatar>
						<span>{agent.name}</span>
					</div>
				</Button>
			)),
		],
		[selectedModel]
	);

	return (
		<div className="w-full h-full flex flex-col justify-end">
			<ScrollArea className="flex-1">
				<ChatMessageList
					participants={conversation.participants}
					messages={conversation.messages || []}
					onReplyTo={handleReplyTo}
					messageActions={messageActions}
				/>
			</ScrollArea>
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
