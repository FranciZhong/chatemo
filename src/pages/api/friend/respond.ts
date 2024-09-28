import { ConversationEvent } from '@/lib/events';
import {
	BadRequestError,
	ConflictError,
	MethodNotAllowedError,
	UnauthorizedError,
} from '@/server/error';
import { USER_PREFFIX } from '@/server/events';
import { wrapErrorHandler } from '@/server/middleware';
import friendService from '@/server/services/friendService';
import userService from '@/server/services/userService';
import { ConversationZType } from '@/types/chat';
import { AcceptRejectPayloadSchema, FormatResponse } from '@/types/common';
import { NextApiResponseServerIO } from '@/types/socket';
import { HttpStatusCode } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'POST') {
		throw new MethodNotAllowedError();
	}

	const token = await getToken({ req });
	if (!token || !token.sub) {
		throw new UnauthorizedError();
	}

	const userId = token.sub;

	const { success, data } = AcceptRejectPayloadSchema.safeParse(req.body);

	if (!success) {
		throw new BadRequestError();
	}

	const { referToId: requestId, status } = data;

	const request = await userService.getFriendRequestById(requestId);
	if (request.receiverId !== userId) {
		throw new BadRequestError();
	}

	if (request.status !== 'PENDING') {
		throw new ConflictError('Redundant operation.');
	}

	if (status === 'REJECTED') {
		await friendService.rejectRequest(requestId);
		res.status(HttpStatusCode.Ok).json({} as FormatResponse<any>);
		return;
	}

	const conversation = await friendService.buildFriendship(userId, requestId);

	res.status(HttpStatusCode.Created).json({} as FormatResponse<any>);

	// emit events
	emitSocketEvents(res, conversation);
};

const emitSocketEvents = async (
	res: NextApiResponse,
	conversation: ConversationZType
) => {
	const io = (res as NextApiResponseServerIO).socket.server.io;
	if (io) {
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
};

export default wrapErrorHandler(handler);
