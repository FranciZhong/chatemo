import { UserEvent } from '@/lib/events';
import { AcceptRejectPayload } from '@/types/common';
import { Server, Socket } from 'socket.io';
import { USER_PREFFIX } from '.';
import { wrapSocketErrorHandler } from '../middleware';
import friendService from '../services/friendService';
import userService from '../services/userService';

const userHandler = (io: Server, socket: Socket) => {
	wrapSocketErrorHandler(
		io,
		socket,
		UserEvent.RESPOND_FRIEND_REQUEST,
		async (payload: AcceptRejectPayload) => {
			const userId = socket.data.session.id as string;
			const requestId = payload.referToId;

			if (payload.status === 'REJECTED') {
				await friendService.rejectRequest(requestId);
				return;
			}

			const conversation = await friendService.buildFriendship(
				userId,
				requestId
			);

			const users = await userService.getByIds(
				conversation.participants.map((item) => item.userId)
			);

			users.forEach((user) => {
				conversation.friendships
					?.filter((item) => item.friendId === user.id)
					.forEach((item) => (item.friend = user));

				conversation.participants
					.filter((item) => item.userId === user.id)
					.forEach((item) => (item.user = user));
			});

			const participantRooms = conversation.participants.map(
				(participant) => USER_PREFFIX + participant.userId
			);

			io.to(participantRooms).emit(UserEvent.NEW_FRIENDSHIP, conversation);

			console.log(
				` Emit event[${UserEvent.NEW_FRIENDSHIP}]`,
				participantRooms,
				conversation
			);
		}
	);
};

export default userHandler;
