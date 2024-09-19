import { MessageZType, ParticipantZType } from '@/types/chat';
import { UserZType } from '@/types/user';
import React, { RefObject, useEffect, useRef, useState } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import ChatMessage from './ChatMessage';

interface Props {
	participants: ParticipantZType[];
	messages: MessageZType[];
	onReplyTo: (messageId: string) => void;
	onScrollTop?: () => void;
	messageActions?: () => ((message: MessageZType) => React.ReactNode)[];
	className?: string;
}

const ChatMessageList: React.FC<Props> = ({
	participants,
	messages,
	onReplyTo,
	onScrollTop,
	messageActions,
	className,
}) => {
	const [isHovered, setIsHovered] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement | null>(null);
	const messageRefs = useRef<RefObject<HTMLDivElement>[]>([]);
	messageRefs.current = messages.map(
		(_, i) => messageRefs.current[i] || React.createRef()
	);
	const [lastIndex, setLastIndex] = useState<number | null>(null);

	const handleScroll = onScrollTop
		? (event: React.UIEvent<HTMLDivElement>) => {
				const { scrollTop } = event.currentTarget;
				if (scrollTop === 0) {
					setLastIndex(messageRefs.current.length - 1);
					onScrollTop();
				}
		  }
		: undefined;

	const scroll2Bottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(() => {
		if (!isHovered) {
			scroll2Bottom();
		} else if (lastIndex) {
			messageRefs.current[lastIndex]?.current?.scrollIntoView({
				behavior: 'auto',
			});
		}
	}, [messages, lastIndex]);

	const id2UserMap = participants.reduce((map, participant) => {
		map.set(participant.userId, participant.user!);
		return map;
	}, new Map<String, UserZType>());

	return (
		<ScrollArea onScroll={handleScroll} className={className}>
			<div
				className="flex flex-col-reverse justify-end p-4 gap-4"
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				<div ref={messagesEndRef} />
				{messages.map((message, index) => (
					<div key={message.id} ref={messageRefs.current[index]}>
						<ChatMessage
							sender={id2UserMap.get(message.senderId)!}
							message={message}
							onReplyTo={onReplyTo}
							actions={
								messageActions &&
								messageActions().map((action) => action(message))
							}
						/>
					</div>
				))}
			</div>
		</ScrollArea>
	);
};

export default ChatMessageList;
