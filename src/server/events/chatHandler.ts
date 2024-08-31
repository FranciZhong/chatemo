import { ChatEvent } from '@/lib/events';
import { ConversationMessagePayload } from '@/types/chat';
import { Server, Socket } from 'socket.io';
import { USER_PREFFIX } from '.';
import { wrapSocketErrorHandler } from '../middleware';
import conversationService from '../services/conversationService';

const chatHandler = (io: Server, socket: Socket) => {
	wrapSocketErrorHandler(
		io,
		socket,
		ChatEvent.SEND_CONVERSATION_MESSAGE,
		async (payload: ConversationMessagePayload) => {
			const senderId = socket.data.session.id as string;

			const message = await conversationService.createMessage(
				senderId,
				payload
			);

			const participants =
				await conversationService.getParticipantsByConversationId(
					payload.conversationId
				);

			const participantRooms = participants.map(
				(item) => USER_PREFFIX + item.userId
			);

			io.to(participantRooms).emit(ChatEvent.NEW_CONVERSATION_MESSAGE, message);
		}
	);
};

export default chatHandler;
