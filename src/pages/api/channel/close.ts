import { ChannelEvent } from '@/lib/events';
import {
	BadRequestError,
	ForbiddenError,
	MethodNotAllowedError,
	UnauthorizedError,
} from '@/server/error';
import { USER_PREFFIX } from '@/server/events';
import { wrapErrorHandler } from '@/server/middleware';
import channelService from '@/server/services/channelService';
import { FormatResponse, IdPayloadSchema } from '@/types/common';
import { NextApiResponseServerIO } from '@/types/socket';
import { HttpStatusCode } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'POST') {
		throw new MethodNotAllowedError();
	}

	const { success, data } = IdPayloadSchema.safeParse(req.body);
	if (!success) {
		throw new BadRequestError();
	}
	const { referToId: channelId } = data;

	const token = await getToken({ req });
	if (!token || !token.sub) {
		throw new UnauthorizedError();
	}

	const userId = token.sub;
	const channel = await channelService.getChannelById(channelId, true);
	if (channel.ownerId !== userId) {
		throw new ForbiddenError();
	}

	await channelService.closeChannel(channelId);

	res.status(HttpStatusCode.Ok).json({
		message: 'Successfully close this channel',
	} as FormatResponse<undefined>);

	// emit event to members
	const io = (res as NextApiResponseServerIO).socket.server.io;
	if (io) {
		channel.memberships?.forEach((membership) => {
			io.to(USER_PREFFIX + membership.userId).emit(
				ChannelEvent.REMOVE_CHANNEL_MEMBERSHIP,
				membership
			);
		});
	}
};

export default wrapErrorHandler(handler);
