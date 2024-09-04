import { MessageZType, ParticipantZType } from '@/types/chat';
import { UserZType } from '@/types/user';
import ChatMessage from './ChatMessage';

interface Props {
	participants: ParticipantZType[];
	messages: MessageZType[];
	onReplyTo: (messageId: string) => void;
}

const ChatMessageList: React.FC<Props> = ({
	participants,
	messages,
	onReplyTo,
}) => {
	const id2UserMap = participants.reduce((map, participant) => {
		map.set(participant.userId, participant.user!);
		return map;
	}, new Map<String, UserZType>());

	return (
		<div className="flex flex-col-reverse justify-end p-4 gap-4">
			{messages.map((message) => (
				<ChatMessage
					key={message.id}
					sender={id2UserMap.get(message.senderId)!}
					message={message}
					onReplyTo={onReplyTo}
				/>
			))}
		</div>
	);
};

export default ChatMessageList;
