import { ImgUrl } from '@/lib/constants';
import { parseFormatedDateTime } from '@/lib/date';
import { cn } from '@/lib/utils';
import useUserStore from '@/store/userStore';
import { MessageZType } from '@/types/chat';
import { UserZType } from '@/types/user';
import { ArrowTopRightIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import { memo, useState } from 'react';
import { useDebounce } from 'use-debounce';
import CopyButton from '../CopyButton';
import MarkdownContent from '../MarkdownContent';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import LoadingContent from './LoadingContent';
import RepliedMessage from './RepliedMessage';

interface Props {
	sender?: UserZType;
	message: MessageZType;
	onReplyTo: (messageId: string) => void;
	actions?: React.ReactNode[];
}

const ChatMessage: React.FC<Props> = ({
	sender,
	message,
	onReplyTo,
	actions,
}) => {
	const { user } = useUserStore();
	const isCurrentUser = user?.id === sender?.id && message.type === 'USER';
	const [mouseOn, setMouseOn] = useState(false);
	const [showButtons] = useDebounce(mouseOn, 500);

	const datetimeObject = parseFormatedDateTime(message.createdAt);

	const getAvatarImage = () => {
		switch (message.type) {
			case 'USER':
				return sender?.image || ImgUrl.USER_AVATAR_ALT;
			case 'MODEL':
				return message.agent?.image || ImgUrl.AGENT_AVATAR_ALT;
		}
	};

	const getName = () => {
		switch (message.type) {
			case 'USER':
				return isCurrentUser ? user?.name : sender?.name || 'Anonymouse';
			case 'MODEL':
				return message.agent
					? `${message.agent?.name} (${message.model})`
					: `[${message.provider?.toUpperCase()}] ${message.model}`;
		}
	};

	return (
		<div
			className={cn(
				'w-full flex',
				isCurrentUser ? 'justify-end' : 'justify-start'
			)}
			onMouseEnter={() => setMouseOn(true)}
			onMouseLeave={() => setMouseOn(false)}
		>
			<div
				className={cn(
					'flex gap-2 items-start',
					isCurrentUser ? 'flex-row-reverse' : ''
				)}
			>
				<Avatar className="h-8 w-8 bg-secondary">
					<AvatarImage src={getAvatarImage()} />
				</Avatar>
				<div
					className={cn(
						'flex flex-col gap-1 message-width',
						isCurrentUser ? 'items-end' : 'items-start'
					)}
				>
					<div
						className={cn(
							'flex gap-2 items-center h-8 w-full',
							isCurrentUser && 'flex-row-reverse'
						)}
					>
						<div className="text-lg font-bold">{getName()}</div>
						{showButtons && (
							<ScrollArea
								dir={isCurrentUser ? 'rtl' : 'ltr'}
								className="flex-1"
							>
								<div className="flex items-center gap-2">
									<CopyButton content={message.content} />
									<Button
										size="xs"
										variant="outline"
										onClick={() => onReplyTo(message.id)}
									>
										<ArrowTopRightIcon className="icon-size" />
									</Button>

									{actions}
								</div>
								<ScrollBar orientation="horizontal" className="invisible" />
							</ScrollArea>
						)}
					</div>

					{message.replyTo && message.replyToMessage ? (
						<RepliedMessage replyTo={message.replyToMessage} />
					) : null}

					{!message.loading ? (
						<>
							{message.content && (
								<MarkdownContent className="message-container">
									{message.content}
								</MarkdownContent>
							)}
							{message.image && (
								<div className="message-container">
									<Image
										src={message.image}
										alt="Image"
										width={280}
										height={210}
										style={{ width: '100%', height: 'auto' }}
									/>
								</div>
							)}
						</>
					) : (
						<LoadingContent className="message-container" />
					)}
					<p className="text-xs text-foreground/50 font-thin">
						{datetimeObject.date} {datetimeObject.time}
					</p>
				</div>
			</div>
		</div>
	);
};

export default memo(ChatMessage);
