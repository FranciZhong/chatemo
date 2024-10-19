import { MessageZType, ParticipantZType } from '@/types/chat';
import { UserZType } from '@/types/user';
import React, { RefObject, useEffect, useRef, useState } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import ChatMessage from './ChatMessage';

interface Props {
	participants: ParticipantZType[];
	messages: MessageZType[];
	onReplyTo: (messageId: string) => void;
	onScrollTop?: () => Promise<void>;
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
	const messageRefs = useRef<RefObject<HTMLDivElement>[]>([]);
	const [latestId, setLatestId] = useState<string | null>(null);
	const [lastIndex, setLastIndex] = useState<number | null>(null);

	// init the ref arr length same with messages
	messageRefs.current = messages.map(
		(_, i) => messageRefs.current[i] || React.createRef()
	);

	const handleScroll = onScrollTop
		? async (event: React.UIEvent<HTMLDivElement>) => {
				const { scrollTop } = event.currentTarget;
				if (scrollTop === 0) {
					setLastIndex(messageRefs.current.length - 1);
					await onScrollTop();
				}
		  }
		: undefined;

	useEffect(() => {
		const latestMessage = messages.at(0);
		// only scoll down when new messages arrive
		if (latestMessage && latestMessage.id !== latestId) {
			setLatestId(latestMessage.id);
			if (!isHovered) {
				messageRefs.current[0]?.current?.scrollIntoView({
					behavior: 'smooth',
				});
			}
		}
	}, [messages, latestId, setLatestId, isHovered]);

	useEffect(() => {
		// keep scrolling position when fetching the history
		if (lastIndex) {
			messageRefs.current[lastIndex]?.current?.scrollIntoView({
				behavior: 'auto',
			});
		}
	}, [lastIndex]);

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
				{/* scroll to top to fetch more */}
				<div className="h-8" />
			</div>
		</ScrollArea>
	);
};

export default ChatMessageList;
