import { NotificationType } from '@/lib/constants';
import { UserEvent } from '@/lib/events';
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
import { NotificationZType } from '@/types/user';
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

	const senderId = token.sub;

	const { success, data } = IdPayloadSchema.safeParse(req.body);
	if (!success) {
		throw new BadRequestError();
	}

	const receiverId = data.referToId;
	const request = await userService.sendFriendRequest(senderId, receiverId);

	res.status(HttpStatusCode.Created).json({
		message: 'A friend request is sent.',
	} as FormatResponse<any>);

	// send notifications to receivers
	const io = (res as NextApiResponseServerIO).socket.server.io;
	if (request && io) {
		const sender = (await userService.getByIds([senderId])).at(0);

		const receiverRoom = USER_PREFFIX + receiverId;
		io.to(receiverRoom).emit(UserEvent.NEW_NOTIFICATION, {
			type: NotificationType.FRIEND_REQUEST,
			referToId: request.id,
			referTo: request,
			from: sender,
			title: NotificationType.FRIEND_REQUEST,
		} as NotificationZType);
	}
};

export default wrapErrorHandler(handler);
