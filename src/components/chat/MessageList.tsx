import { MessageWithReplyZType, ParticipantZType } from '@/types/chat';
import { UserZType } from '@/types/user';
import ChatMessage from './ChatMessage';

interface Props {
	participants: ParticipantZType[];
	messages: MessageWithReplyZType[];
}

const MessageList: React.FC<Props> = ({ participants, messages }) => {
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
				/>
			))}
		</div>
	);
};

export default MessageList;
