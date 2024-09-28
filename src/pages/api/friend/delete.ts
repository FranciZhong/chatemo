import { ConversationEvent } from '@/lib/events';
import {
	BadRequestError,
	MethodNotAllowedError,
	UnauthorizedError,
} from '@/server/error';
import { USER_PREFFIX } from '@/server/events';
import { wrapErrorHandler } from '@/server/middleware';
import userService from '@/server/services/userService';
import { FormatResponse, IdPayloadSchema } from '@/types/common';
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

	const { success, data: payload } = IdPayloadSchema.safeParse(req.body);
	if (!success) {
		throw new BadRequestError();
	}

	const friendships = await userService.getFriendshipsById(payload.referToId);

	if (friendships.length === 0 || friendships.at(0)?.userId !== userId) {
		throw new BadRequestError();
	}

	await userService.deleteConversation(friendships.at(0)!.conversationId);

	res.status(HttpStatusCode.Ok).json({
		message: 'A friend connection is deleted.',
	} as FormatResponse<undefined>);

	// emit events to update conversation
	const io = (res as NextApiResponseServerIO).socket.server.io;
	if (io) {
		friendships.forEach((friendship) => {
			io.to(USER_PREFFIX + friendship.userId).emit(
				ConversationEvent.REMOVE_FRIENDSHIP,
				friendship
			);
		});
	}
};

export default wrapErrorHandler(handler);
