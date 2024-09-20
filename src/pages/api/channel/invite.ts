import { NotificationType } from '@/lib/constants';
import { UserEvent } from '@/lib/events';
import {
	BadRequestError,
	ConflictError,
	ForbiddenError,
	MethodNotAllowedError,
	UnauthorizedError,
} from '@/server/error';
import { USER_PREFFIX } from '@/server/events';
import { wrapErrorHandler } from '@/server/middleware';
import channelService from '@/server/services/channelService';
import userService from '@/server/services/userService';
import { FormatResponse, ParentChildIdPayloadSchema } from '@/types/common';
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
	if (!token) {
		throw new UnauthorizedError();
	}

	const senderId = token.sub;
	if (!senderId) {
		throw new UnauthorizedError();
	}

	const { parentId: channelId, childId: receiverId } =
		ParentChildIdPayloadSchema.parse(await req.body);

	const channel = await channelService.getChannelById(channelId, true);
	if (!channel) {
		throw new BadRequestError();
	}

	if (channel.ownerId !== senderId) {
		throw new ForbiddenError(
			'Only the channel owner is allowed to invite people.'
		);
	}

	const membership = await channelService.getMembershipByChannelUser(
		channelId,
		receiverId
	);
	if (membership?.valid === 'VALID') {
		throw new ConflictError('This user has already joined this channel.');
	}

	const request = await channelService.createInviteRequest(
		senderId,
		receiverId,
		channelId
	);

	res.status(HttpStatusCode.Created).json({
		message: 'A invite request to this user is sent.',
	} as FormatResponse<any>);

	// send notifications to receivers
	const io = (res as NextApiResponseServerIO).socket.server.io;
	if (request && io) {
		const sender = (await userService.getByIds([senderId])).at(0);

		const receiverRoom = USER_PREFFIX + receiverId;
		io.to(receiverRoom).emit(UserEvent.NEW_NOTIFICATION, {
			type: NotificationType.JOIN_CHANNEL_REQUEST,
			referToId: request.id,
			referTo: request,
			from: sender,
			title: NotificationType.JOIN_CHANNEL_REQUEST,
		} as NotificationZType);
	}
};

export default wrapErrorHandler(handler);
