import { ImgUrl } from '@/lib/constants';
import { AgentEvent } from '@/lib/events';
import { cn } from '@/lib/utils';
import useSocketStore from '@/store/socketStore';
import {
	AgentPreviewPayload,
	AgentZType,
	LlmModelZType,
	StreamMessagePayload,
} from '@/types/llm';
import { Cross1Icon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypePrism from 'rehype-prism';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import { v4 as uuidv4 } from 'uuid';
import CopyButton from '../CopyButton';
import IconButton from '../IconButton';
import { Avatar, AvatarImage } from '../ui/avatar';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';

interface Props {
	request: string;
	model: LlmModelZType;
	agent: AgentZType | null;
	onClose: () => void;
	className?: string;
}

const AgentPreview: React.FC<Props> = ({
	request,
	model,
	agent,
	onClose,
	className,
}) => {
	const { socket } = useSocketStore();
	const [response, setResponse] = useState<string>('');
	const [finished, setFinished] = useState<boolean>(false);

	useEffect(() => {
		const previewId = uuidv4();
		setFinished(false);
		setResponse('');

		socket?.emit(AgentEvent.START_PREVIEW_STREAM, {
			...model,
			referToId: previewId,
			request,
			agentId: agent?.id,
		} as AgentPreviewPayload);

		const previewListener = (payload: StreamMessagePayload) => {
			if (payload.referToId !== previewId) {
				// not from this preview window
				return;
			} else if (payload.finished) {
				setFinished(true);
			} else if (payload.chunk) {
				setResponse((state) => state + payload.chunk);
			}
		};

		socket?.on(AgentEvent.PREVIEW_STREAM_CHUNK, previewListener);

		return () => {
			socket?.off(AgentEvent.PREVIEW_STREAM_CHUNK, previewListener);
		};
	}, [request, model, agent, setFinished]);

	return (
		<div className={cn('flex flex-col p-2 gap-2', className)}>
			<div className="flex justify-between items-center">
				<div className="flex gap-2 items-center">
					<Avatar className="h-8 w-8 bg-secondary">
						<AvatarImage src={agent?.image || ImgUrl.AGENT_AVATAR_ALT} />
					</Avatar>
					<div className="text-lg font-bold text-single-line">
						{agent?.name || `[${model.provider?.toUpperCase()}] ${model.model}`}
					</div>
				</div>
				<IconButton onClick={onClose}>
					<Cross1Icon />
				</IconButton>
			</div>
			<ScrollArea className="flex-1">
				<div className="flex flex-col gap-1 message-width">
					<div className="message-container">
						<ReactMarkdown
							className="prose"
							remarkPlugins={[remarkGfm, remarkBreaks]}
							rehypePlugins={[rehypePrism]}
						>
							{response}
						</ReactMarkdown>
					</div>

					{finished && (
						<div className="flex justify-end items-center gap-2">
							<CopyButton content={response} />
						</div>
					)}
				</div>
				<ScrollBar orientation="vertical" hidden={true} />
			</ScrollArea>
		</div>
	);
};

export default AgentPreview;
