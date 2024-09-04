import { ImgUrl } from '@/lib/constants';
import { parseFormatedDateTime } from '@/lib/date';
import { cn } from '@/lib/utils';
import useUserStore from '@/store/userStore';
import { MessageZType } from '@/types/chat';
import { UserZType } from '@/types/user';
import { ArrowTopRightIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import RepliedMessage from './RepliedMessage';

interface Props {
	sender: UserZType;
	message: MessageZType;
	onReplyTo: (messageId: string) => void;
}

const ChatMessage: React.FC<Props> = ({ sender, message, onReplyTo }) => {
	const { user } = useUserStore();
	const isCurrentUser = user?.id === sender.id;

	const [mouseOn, setMouseOn] = useState(false);

	const datetimeObject = parseFormatedDateTime(message.createdAt);

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
					<AvatarImage src={sender?.image || ImgUrl.USER_AVATAR_ALT} />
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
						<div className="text-lg font-bold">{sender?.name}</div>
						{mouseOn && (
							<ScrollArea className="flex-1">
								<div
									className={cn(
										'flex items-center gap-2',
										isCurrentUser && 'justify-end'
									)}
								>
									<Button
										size="xs"
										variant="outline"
										onClick={() => onReplyTo(message.id)}
									>
										<ArrowTopRightIcon />
									</Button>
								</div>
								<ScrollBar orientation="horizontal" className="invisible" />
							</ScrollArea>
						)}
					</div>

					{message.replyTo && message.replyToMessage ? (
						<RepliedMessage replyTo={message.replyToMessage} />
					) : null}

					<div className="p-2 rounded-lg bg-hover text-md">
						<p className="break-words break-all">{message.content}</p>
					</div>
					<p className="text-xs text-foreground/50 font-thin">
						{datetimeObject.date} {datetimeObject.time}
					</p>
				</div>
			</div>
		</div>
	);
};

export default ChatMessage;
