import { ChatEvent } from '@/lib/events';
import { ConversationMessagePayload } from '@/types/chat';
import { IdPayload, ParentChildIdPayload } from '@/types/common';
import { Server, Socket } from 'socket.io';
import { USER_PREFFIX } from '.';
import { ForbiddenError } from '../error';
import { wrapSocketErrorHandler } from '../middleware';
import conversationService from '../services/conversationService';

const chatHandler = (io: Server, socket: Socket) => {
	wrapSocketErrorHandler(
		socket,
		ChatEvent.SEND_CONVERSATION_MESSAGE,
		async (payload: ConversationMessagePayload) => {
			const senderId = socket.data.session.id as string;

			const message = await conversationService.createMessage(
				senderId,
				'USER',
				false,
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

	wrapSocketErrorHandler(
		socket,
		ChatEvent.DELETE_CONVERSATION_MESSAGE,
		async (payload: IdPayload) => {
			const senderId = socket.data.session.id as string;

			const message = await conversationService.getMessageById(
				payload.referToId
			);
			if (message.senderId !== senderId) {
				throw new ForbiddenError(
					'Cannot delete a message from other participants.'
				);
			}

			await conversationService.deleteMessage(payload.referToId);

			const participants =
				await conversationService.getParticipantsByConversationId(
					message.conversationId
				);

			const participantRooms = participants.map(
				(item) => USER_PREFFIX + item.userId
			);

			io.to(participantRooms).emit(ChatEvent.REMOVE_CONVERSATION_MESSAGE, {
				parentId: message.conversationId,
				childId: message.id,
			} as ParentChildIdPayload);
		}
	);
};

export default chatHandler;
