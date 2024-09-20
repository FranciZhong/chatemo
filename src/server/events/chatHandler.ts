import { ChannelEvent, ConversationEvent } from '@/lib/events';
import {
	ChannelMessagePayload,
	ConversationMessagePayload,
} from '@/types/chat';
import { IdPayload, ParentChildIdPayload } from '@/types/common';
import { Server, Socket } from 'socket.io';
import { CHANNEL_PREFIX, USER_PREFFIX } from '.';
import { BadRequestError, ForbiddenError } from '../error';
import { wrapSocketErrorHandler } from '../middleware';
import channelService from '../services/channelService';
import conversationService from '../services/conversationService';

const chatHandler = (io: Server, socket: Socket) => {
	wrapSocketErrorHandler(
		socket,
		ConversationEvent.SEND_CONVERSATION_MESSAGE,
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

			io.to(participantRooms).emit(
				ConversationEvent.NEW_CONVERSATION_MESSAGE,
				message
			);
		}
	);

	wrapSocketErrorHandler(
		socket,
		ConversationEvent.DELETE_CONVERSATION_MESSAGE,
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

			io.to(participantRooms).emit(
				ConversationEvent.REMOVE_CONVERSATION_MESSAGE,
				{
					parentId: message.conversationId,
					childId: message.id,
				} as ParentChildIdPayload
			);
		}
	);

	wrapSocketErrorHandler(
		socket,
		ChannelEvent.JOIN_CHANNEL_ROOM,
		async (channelId: string) => {
			const senderId = socket.data.session.id as string;
			const membership = await channelService.getMembershipByChannelUser(
				channelId,
				senderId
			);
			if (!membership || membership.valid === 'INVALID') {
				throw new BadRequestError();
			}

			const channelRoom = CHANNEL_PREFIX + channelId;
			socket.join(channelRoom);
		}
	);

	wrapSocketErrorHandler(
		socket,
		ChannelEvent.LEAVE_CHANNEL_ROOM,
		async (channelId: string) => {
			socket.leave(CHANNEL_PREFIX + channelId);
		}
	);

	wrapSocketErrorHandler(
		socket,
		ChannelEvent.SEND_CHANNEL_MESSAGE,
		async (payload: ChannelMessagePayload) => {
			const senderId = socket.data.session.id as string;

			const message = await channelService.createMessage(
				senderId,
				'USER',
				false,
				payload
			);

			io.to(CHANNEL_PREFIX + payload.channelId).emit(
				ChannelEvent.NEW_CHANNEL_MESSAGE,
				message
			);
		}
	);

	wrapSocketErrorHandler(
		socket,
		ChannelEvent.DELETE_CHANNEL_MESSAGE,
		async (payload: IdPayload) => {
			const senderId = socket.data.session.id as string;

			const message = await channelService.getMessageById(payload.referToId);
			if (!message) {
				return;
			}

			if (message.senderId !== senderId) {
				throw new ForbiddenError('Cannot delete a message from other members.');
			}

			await channelService.deleteMessage(payload.referToId);
			io.to(CHANNEL_PREFIX + message.channelId).emit(
				ChannelEvent.REMOVE_CHANNEL_MESSAGE,
				{
					parentId: message.channelId,
					childId: message.id,
				} as ParentChildIdPayload
			);
		}
	);
};

export default chatHandler;
