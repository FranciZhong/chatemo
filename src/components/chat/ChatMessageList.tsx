import { MessageZType, ParticipantZType } from '@/types/chat';
import { UserZType } from '@/types/user';
import { useEffect, useRef, useState } from 'react';
import ChatMessage from './ChatMessage';

interface Props {
	participants: ParticipantZType[];
	messages: MessageZType[];
	onReplyTo: (messageId: string) => void;
	messageActions?: ((message: MessageZType) => React.ReactNode)[];
}

const ChatMessageList: React.FC<Props> = ({
	participants,
	messages,
	onReplyTo,
	messageActions,
}) => {
	const [isHovered, setIsHovered] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const scroll2Bottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(() => {
		if (!isHovered) {
			scroll2Bottom();
		}
	}, [messages]);

	const id2UserMap = participants.reduce((map, participant) => {
		map.set(participant.userId, participant.user!);
		return map;
	}, new Map<String, UserZType>());

	return (
		<div
			className="flex flex-col-reverse justify-end p-4 gap-4"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<div ref={messagesEndRef} />
			{messages.map((message) => (
				<ChatMessage
					key={message.id}
					sender={id2UserMap.get(message.senderId)!}
					message={message}
					onReplyTo={onReplyTo}
					actions={messageActions?.map((action) => action(message))}
				/>
			))}
		</div>
	);
};

export default ChatMessageList;
