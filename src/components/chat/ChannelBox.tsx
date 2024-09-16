'use client';

import axiosInstance from '@/lib/axios';
import {
	ApiUrl,
	LlmProviderName,
	TAKE_MESSAGES_DEFAULT,
} from '@/lib/constants';
import { AgentEvent, ChatEvent } from '@/lib/events';
import useAgentStore from '@/store/agentStore';
import useChannelStore from '@/store/channelStore';
import useSocketStore from '@/store/socketStore';
import {
	BasicChannelMessageZType,
	ChannelMessagePayload,
	ChannelMessageZType,
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
	channelId: string;
}

const ChannelBox: React.FC<Props> = ({ channelId }) => {
	const { channels, updateChannel } = useChannelStore();
	const { agents } = useAgentStore();
	const { socket } = useSocketStore();
	const { toast } = useToast();
	// todo
	const [selectedModel, setSelectedModel] = useState<LlmModelZType>({
		provider: LlmProviderName.OPENAI,
		model: 'gpt-4o-mini',
	});

	const channel = channels.find((item) => item.id === channelId)!;

	const [replyTo, setReplyTo] = useState<BasicChannelMessageZType | null>(null);

	const handleReplyTo = useCallback(
		(messageId: string) => {
			const matchedMessage =
				channel.messages?.find((item) => item.id === messageId) || null;

			setReplyTo(matchedMessage);
		},
		[setReplyTo, channel]
	);

	const deleteReplyTo = useCallback(() => setReplyTo(null), [setReplyTo]);

	useEffect(() => {
		const updateChannelMessages = async () => {
			if (!channel?.messages) {
				try {
					const response = await axiosInstance.get<
						FormatResponse<ChannelMessageZType[]>
					>(ApiUrl.GET_CHANNEL_MESSAGES, {
						params: {
							channelId: channel.id,
							skip: 0,
							take: TAKE_MESSAGES_DEFAULT,
						},
					});
					const messages = response.data.data;
					updateChannel({
						...channel,
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

		updateChannelMessages();
	}, [channel, toast, updateChannel]);

	const handleSubmit = useCallback(
		(payload: MessagePayload) => {
			const channelPayload: ChannelMessagePayload = {
				...payload,
				channelId,
			};
			socket?.emit(ChatEvent.SEND_CHANNEL_MESSAGE, channelPayload);
		},
		[socket, channelId]
	);

	const messageActions = useCallback(
		() => [
			(message: MessageZType) => (
				<Button
					key={`agent-none-${message.id}`}
					size="xs"
					variant="outline"
					onClick={() => {
						socket?.emit(AgentEvent.AGENT_REPLY_CHANNEL, {
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
								socket?.emit(AgentEvent.AGENT_REPLY_CHANNEL, {
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
					participants={channel.memberships || []}
					messages={channel.messages || []}
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

export default ChannelBox;
