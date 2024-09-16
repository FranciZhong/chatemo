'use client';

import axiosInstance from '@/lib/axios';
import {
	ApiUrl,
	LlmProviderName,
	TAKE_MESSAGES_DEFAULT,
} from '@/lib/constants';
import { AgentEvent, ChatEvent } from '@/lib/events';
import useAgentStore from '@/store/agentStore';
import useConversationStore from '@/store/conversationStore';
import useSocketStore from '@/store/socketStore';
import {
	BasicConversationMessageZType,
	ConversationMessagePayload,
	ConversationMessageZType,
	MessagePayload,
	MessageZType,
} from '@/types/chat';
import { FormatResponse } from '@/types/common';
import { AgentReplyPayload, LlmModelZType } from '@/types/llm';
import { RocketIcon } from '@radix-ui/react-icons';
import { useCallback, useEffect, useState } from 'react';
import AgentHelpButton from '../AgentHelpButton';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { useToast } from '../ui/use-toast';
import ChatEditer from './ChatEditer';
import ChatMessageList from './ChatMessageList';

interface Props {
	conversationId: string;
}

const ConversationBox: React.FC<Props> = ({ conversationId }) => {
	const { conversations, updateConversation } = useConversationStore();
	const { agents } = useAgentStore();
	const { socket } = useSocketStore();
	const { toast } = useToast();
	const [selectedModel, setSelectedModel] = useState<LlmModelZType>({
		provider: LlmProviderName.OPENAI,
		model: 'gpt-4o-mini',
	});

	const conversation = conversations.find(
		(item) => item.id === conversationId
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
							conversationId: conversation.id,
							skip: 0,
							take: TAKE_MESSAGES_DEFAULT,
						},
					});
					const messages = response.data.data;
					updateConversation({
						...conversation,
						messages,
					});
				} catch (error) {
					toast({
						title: 'Error',
						description: 'Something went wrong.',
					});
				}
			}
		};

		updateConversationMessages();
	}, [conversation, toast, updateConversation]);

	const handleSubmit = useCallback(
		(payload: MessagePayload) => {
			const convPayload: ConversationMessagePayload = {
				...payload,
				conversationId,
			};
			socket?.emit(ChatEvent.SEND_CONVERSATION_MESSAGE, convPayload);
		},
		[socket, conversationId]
	);

	const messageActions = useCallback(
		() => [
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
			<ScrollArea className="flex-1">
				<ChatMessageList
					participants={conversation.participants || []}
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
