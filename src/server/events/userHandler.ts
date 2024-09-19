import {
	AgentEvent,
	ChannelEvent,
	ConversationEvent,
	UserEvent,
} from '@/lib/events';
import { AcceptRejectPayload } from '@/types/common';
import { LlmModelZType } from '@/types/llm';
import { RequestStatus } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { CHANNEL_PREFIX, USER_PREFFIX } from '.';
import { BadRequestError, ConflictError } from '../error';
import { wrapSocketErrorHandler } from '../middleware';
import channelService from '../services/channelService';
import friendService from '../services/friendService';
import userService from '../services/userService';

const userHandler = (io: Server, socket: Socket) => {
	wrapSocketErrorHandler(
		socket,
		ConversationEvent.RESPOND_FRIEND_REQUEST,
		async (payload: AcceptRejectPayload) => {
			const userId = socket.data.session.id as string;
			const requestId = payload.referToId;

			const request = await userService.getFriendRequestById(requestId);
			if (request.receiverId !== userId) {
				throw new BadRequestError();
			}

			if (request.status !== RequestStatus.PENDING) {
				throw new ConflictError('Redundant operation.');
			}

			if (payload.status === 'REJECTED') {
				await friendService.rejectRequest(requestId);
				return;
			}

			const conversation = await friendService.buildFriendship(
				userId,
				requestId
			);

			const users = await userService.getByIds(
				conversation.participants!.map((item) => item.userId)
			);

			users.forEach((user) => {
				conversation.friendships
					?.filter((item) => item.friendId === user.id)
					.forEach((item) => (item.friend = user));

				conversation
					.participants!.filter((item) => item.userId === user.id)
					.forEach((item) => (item.user = user));
			});

			const participantRooms = conversation.participants!.map(
				(participant) => USER_PREFFIX + participant.userId
			);

			io.to(participantRooms).emit(
				ConversationEvent.NEW_FRIENDSHIP,
				conversation
			);

			console.log(
				` Emit event[${ConversationEvent.NEW_FRIENDSHIP}]`,
				participantRooms,
				conversation
			);
		}
	);

	// todo make http
	wrapSocketErrorHandler(
		socket,
		ChannelEvent.RESPOND_JOIN_CHANNEL,
		async (payload: AcceptRejectPayload) => {
			const userId = socket.data.session.id as string;
			const requestId = payload.referToId;

			const request = await channelService.getChannelRequestById(requestId);
			if (request.type !== 'JOIN' || request.receiverId !== userId) {
				throw new BadRequestError();
			}

			if (request.status !== RequestStatus.PENDING) {
				throw new ConflictError('Redundant operation.');
			}

			if (payload.status === 'REJECTED') {
				await channelService.rejectRequest(requestId);
				return;
			}

			const existMembership = await channelService.getMembershipByChannelUser(
				request.channelId,
				request.senderId
			);

			const membership = await channelService.buildMembership(requestId);

			if (existMembership?.valid === 'VALID') {
				return;
			}

			// emit to other users a new member join
			const channelRoom = CHANNEL_PREFIX + membership.channelId;
			io.to(channelRoom).emit(ChannelEvent.NEW_CHANNEL_MEMBERSHIP, membership);
			console.log(
				` Emit event[${ChannelEvent.NEW_CHANNEL_MEMBERSHIP}]`,
				membership
			);

			// emit to user for new channel
			const channel = await channelService.getChannelById(
				request.channelId,
				true
			);
			io.to(USER_PREFFIX + membership.userId).emit(
				ChannelEvent.JOIN_NEW_CHANNEL,
				channel
			);
			console.log(` Emit event[${ChannelEvent.JOIN_NEW_CHANNEL}]`, channel);
		}
	);

	wrapSocketErrorHandler(socket, UserEvent.UPDATE_APIKEYS, async () => {
		const userId = socket.data.session.id as string;
		const providerMap = await userService.initProviders(userId);
		socket.data.providerMap = providerMap;

		let availableModels = [] as LlmModelZType[];
		providerMap.forEach(async (provider) => {
			const models = await provider.getModels();
			availableModels = [...availableModels, ...models];
		});

		socket.emit(AgentEvent.AVAILABLE_MODELS, availableModels);
	});
};

export default userHandler;
