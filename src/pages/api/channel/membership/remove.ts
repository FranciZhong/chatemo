import { ChannelEvent } from '@/lib/events';
import {
	BadRequestError,
	ForbiddenError,
	MethodNotAllowedError,
	UnauthorizedError,
} from '@/server/error';
import { CHANNEL_PREFIX } from '@/server/events';
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

	const payload = IdPayloadSchema.parse(req.body);
	if (!payload) {
		throw new BadRequestError();
	}

	const token = await getToken({ req });
	if (!token) {
		throw new UnauthorizedError();
	}

	const userId = token.sub!;
	const membership = await channelService.getMembershipById(payload.referToId);
	if (!membership || membership.valid === 'INVALID') {
		throw new BadRequestError();
	}

	const channel = await channelService.getChannelById(
		membership.channelId,
		true
	);

	if (channel.ownerId !== userId) {
		throw new ForbiddenError();
	}

	await channelService.removeMembershipById(payload.referToId);

	res.status(HttpStatusCode.Ok).json({
		message: 'A membership is removed',
	} as FormatResponse<undefined>);

	// emit event to memberships
	const io = (res as NextApiResponseServerIO).socket.server.io;
	if (membership && io) {
		const channelRoom = CHANNEL_PREFIX + channel.id;
		io.to(channelRoom).emit(ChannelEvent.REMOVE_CHANNEL_MEMBERSHIP, membership);
	}
};

export default wrapErrorHandler(handler);
