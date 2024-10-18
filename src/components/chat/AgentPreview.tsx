import { ImgUrl, LlmRole, MESSAGE_TIMEOUT } from '@/lib/constants';
import { AgentEvent } from '@/lib/events';
import { cn } from '@/lib/utils';
import useSocketStore from '@/store/socketStore';
import {
	AgentPreviewPayload,
	AgentZType,
	LlmModelZType,
	StreamMessagePayload,
	UidLlmMessageZType,
} from '@/types/llm';
import { Cross1Icon } from '@radix-ui/react-icons';
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import CopyButton from '../CopyButton';
import IconButton from '../IconButton';
import MarkdownContent from '../MarkdownContent';
import { Avatar, AvatarImage } from '../ui/avatar';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';

interface AgentPreviewProps {
	model: LlmModelZType;
	agent: AgentZType | null;
	onClose: () => void;
	className?: string;
}

export interface AgentPreviewHandle {
	request: (content: string) => void;
}

const AgentPreview = React.forwardRef<AgentPreviewHandle, AgentPreviewProps>(
	({ model, agent, onClose, className }, ref) => {
		const { socket } = useSocketStore();
		const [history, setHistory] = useState<UidLlmMessageZType[]>([]);

		React.useImperativeHandle(ref, () => ({
			request: (content: string) => {
				if (!content) {
					return;
				}
				const requestId = uuidv4();
				const responseId = uuidv4();
				setHistory((prevHistory) => [
					...prevHistory,
					{
						uid: requestId,
						role: LlmRole.USER,
						content,
					},
					{
						uid: responseId,
						role: LlmRole.ASSISTANT,
						content: '',
					},
				]);

				socket?.emit(AgentEvent.START_PREVIEW_STREAM, {
					model,
					referToId: responseId,
					history: [
						...history,
						{
							role: LlmRole.USER,
							content,
						},
					],
					agentId: agent?.id,
				} as AgentPreviewPayload);

				const previewListener = (payload: StreamMessagePayload) => {
					if (payload.referToId !== responseId) {
						// not for this preview message
						return;
					} else if (payload.finished) {
						return;
					} else if (payload.chunk) {
						setHistory((prevHistory) =>
							prevHistory.map((message) =>
								message.uid === payload.referToId
									? {
											...message,
											content: message.content! + payload.chunk,
									  }
									: message
							)
						);
					}
				};

				socket?.on(AgentEvent.PREVIEW_STREAM_CHUNK, previewListener);

				setTimeout(
					() => socket?.off(AgentEvent.PREVIEW_STREAM_CHUNK, previewListener),
					MESSAGE_TIMEOUT
				);
			},
		}));

		return (
			<div className={cn('flex flex-col p-2 gap-2', className)}>
				<div className="flex justify-between items-center">
					<div className="flex gap-2 items-center">
						<Avatar className="h-8 w-8 bg-secondary">
							<AvatarImage src={agent?.image || ImgUrl.AGENT_AVATAR_ALT} />
						</Avatar>
						<div className="text-lg font-bold text-single-line">
							{(agent ? `${agent.name} - ` : '') +
								`[${model.provider?.toUpperCase()}] ${model.model}`}
						</div>
					</div>
					<IconButton onClick={onClose}>
						<Cross1Icon />
					</IconButton>
				</div>
				<ScrollArea className="flex-1">
					<div className="flex flex-col gap-2 px-4">
						{history.map((message) => (
							<div
								key={message.uid}
								className={cn(
									'w-full flex flex-col gap-1',
									message.role === LlmRole.USER && 'items-end'
								)}
							>
								<div className="message-width">
									<MarkdownContent className="message-container">
										{message.content}
									</MarkdownContent>
								</div>
								{message.role === LlmRole.ASSISTANT && message.content && (
									<div className="flex items-center gap-2">
										<CopyButton content={message.content} />
									</div>
								)}
							</div>
						))}
					</div>
					<ScrollBar orientation="vertical" hidden={true} />
				</ScrollArea>
			</div>
		);
	}
);

AgentPreview.displayName = 'AgentPreview';

export default AgentPreview;
