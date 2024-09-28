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
	const membership = await channelService.getMembershipByChannelUser(
		channelId,
		userId
	);
	if (!membership || membership.valid === 'INVALID') {
		throw new BadRequestError();
	}

	const channel = await channelService.getChannelById(channelId, false);
	if (channel.ownerId === userId) {
		throw new ForbiddenError(
			'Assign the ownership to another member before you leave.'
		);
	}

	await channelService.removeMembershipById(membership.id);

	res.status(HttpStatusCode.Ok).json({
		message: 'Successfully leave this channel.',
	} as FormatResponse<undefined>);

	// emit event to members
	const io = (res as NextApiResponseServerIO).socket.server.io;
	if (membership && io) {
		const channelRoom = CHANNEL_PREFIX + membership.channelId;
		io.to(channelRoom).emit(ChannelEvent.REMOVE_CHANNEL_MEMBERSHIP, membership);
	}
};

export default wrapErrorHandler(handler);
