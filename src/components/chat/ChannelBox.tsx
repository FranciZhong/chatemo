'use client';

import axiosInstance from '@/lib/axios';
import {
	ApiUrl,
	LlmProviderName,
	PageUrl,
	TAKE_MESSAGES_DEFAULT,
} from '@/lib/constants';
import { AgentEvent, ChannelEvent } from '@/lib/events';
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
import { FormatResponse, IdPayload, SkipTakeQuery } from '@/types/common';
import { AgentReplyPayload, LlmModelZType } from '@/types/llm';
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
	channelId: string;
}

const ChannelBox: React.FC<Props> = ({ channelId }) => {
	const { channels, pushMessages } = useChannelStore();
	const { agents } = useAgentStore();
	const { socket } = useSocketStore();
	const { toast } = useToast();
	// todo
	const [selectedModel, setSelectedModel] = useState<LlmModelZType>({
		provider: LlmProviderName.OPENAI,
		model: 'gpt-4o-mini',
	});
	const [moreMessages, setMoreMessages] = useState(true);
	const [replyTo, setReplyTo] = useState<BasicChannelMessageZType | null>(null);

	const channel = channels.find((item) => item.id === channelId)!;
	if (!channel) {
		redirect(PageUrl.CHAT);
	}

	const handleReplyTo = useCallback(
		(messageId: string) => {
			const matchedMessage =
				channel.messages?.find((item) => item.id === messageId) || null;

			setReplyTo(matchedMessage);
		},
		[setReplyTo, channel]
	);

	const deleteReplyTo = useCallback(() => setReplyTo(null), [setReplyTo]);

	const fetchMessages = useCallback(async () => {
		if (!moreMessages) {
			return;
		}
		try {
			const response = await axiosInstance.get<
				FormatResponse<ChannelMessageZType[]>
			>(ApiUrl.GET_CHANNEL_MESSAGES, {
				params: {
					referToId: channel.id,
					skip: channel.messages?.length || 0,
					take: TAKE_MESSAGES_DEFAULT,
				} as SkipTakeQuery,
			});
			const messages = response.data.data;
			if (messages && messages?.length !== 0) {
				pushMessages(channel.id, messages);
			} else {
				setMoreMessages(false);
			}
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Something went wrong.',
			});
		}
	}, [moreMessages, channel, pushMessages, setMoreMessages, toast]);

	useEffect(() => {
		if (
			moreMessages &&
			(!channel?.messages || channel.messages.length < TAKE_MESSAGES_DEFAULT)
		) {
			fetchMessages();
		}
	}, [channel, moreMessages, fetchMessages]);

	const handleSubmit = useCallback(
		(payload: MessagePayload) => {
			const channelPayload: ChannelMessagePayload = {
				...payload,
				channelId,
			};
			socket?.emit(ChannelEvent.SEND_CHANNEL_MESSAGE, channelPayload);
		},
		[socket, channelId]
	);

	const messageActions = useCallback(
		() => [
			(message: MessageZType) => (
				<DeleteButton
					key={`delete-message-${message.id}`}
					onDelete={() => {
						socket?.emit(ChannelEvent.DELETE_CHANNEL_MESSAGE, {
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
			<ChatMessageList
				participants={channel.memberships || []}
				messages={channel.messages || []}
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

export default ChannelBox;
