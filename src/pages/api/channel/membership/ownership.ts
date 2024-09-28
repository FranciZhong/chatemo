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
import { FormatResponse, ParentChildIdPayloadSchema } from '@/types/common';
import { NextApiResponseServerIO } from '@/types/socket';
import { HttpStatusCode } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'POST') {
		throw new MethodNotAllowedError();
	}

	const { success, data } = ParentChildIdPayloadSchema.safeParse(req.body);
	if (!success) {
		throw new BadRequestError();
	}
	const { parentId: channelId, childId: ownerId } = data;

	const token = await getToken({ req });
	if (!token || !token.sub) {
		throw new UnauthorizedError();
	}

	const userId = token.sub;
	const channel = await channelService.getChannelById(channelId, false);
	if (channel.valid !== 'VALID' || channel.ownerId !== userId) {
		throw new ForbiddenError();
	}

	const membership = await channelService.getMembershipByChannelUser(
		channelId,
		ownerId
	);
	if (!membership || membership.valid === 'INVALID') {
		throw new BadRequestError('Only members can be assigned as the new owner.');
	}

	await channelService.assignOwnership(channelId, ownerId);

	res.status(HttpStatusCode.Ok).json({
		message: 'The channel ownership is updated',
	} as FormatResponse<undefined>);

	// emit event to members
	channel.ownerId = ownerId;
	const io = (res as NextApiResponseServerIO).socket.server.io;
	if (io) {
		const channelRoom = CHANNEL_PREFIX + channel.id;
		io.to(channelRoom).emit(ChannelEvent.UPDATE_CHANNEL_META, channel);
	}
};

export default wrapErrorHandler(handler);
