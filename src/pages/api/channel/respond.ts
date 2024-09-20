import { ChannelEvent } from '@/lib/events';
import {
	BadRequestError,
	ConflictError,
	MethodNotAllowedError,
	UnauthorizedError,
} from '@/server/error';
import { CHANNEL_PREFIX, USER_PREFFIX } from '@/server/events';
import { wrapErrorHandler } from '@/server/middleware';
import channelService from '@/server/services/channelService';
import { ChannelMembershipZType } from '@/types/chat';
import { AcceptRejectPayloadSchema, FormatResponse } from '@/types/common';
import { NextApiResponseServerIO } from '@/types/socket';
import { RequestStatus } from '@prisma/client';
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

	const userId = token.sub;
	if (!userId) {
		throw new UnauthorizedError();
	}

	const { referToId: requestId, status } = AcceptRejectPayloadSchema.parse(
		await req.body
	);

	const request = await channelService.getChannelRequestById(requestId);
	if (!request || request.receiverId !== userId) {
		throw new BadRequestError();
	}

	if (request.status !== RequestStatus.PENDING) {
		throw new ConflictError('Redundant operation.');
	}

	if (status === 'REJECTED') {
		await channelService.rejectRequest(requestId);
		res.status(HttpStatusCode.Ok).json({} as FormatResponse<any>);
		return;
	}

	const memberId =
		request.type === 'JOIN' ? request.senderId : request.receiverId;
	const existMembership = await channelService.getMembershipByChannelUser(
		request.channelId,
		memberId
	);

	const membership = await channelService.buildMembership(requestId);

	res.status(HttpStatusCode.Ok).json({} as FormatResponse<any>);

	// only emit events when new membership is built
	if (existMembership?.valid !== 'VALID') {
		emitSocketEvents(res, membership);
	}
};

const emitSocketEvents = async (
	res: NextApiResponse,
	membership: ChannelMembershipZType
) => {
	const io = (res as NextApiResponseServerIO).socket.server.io;
	if (io) {
		// emit to other users a new member join
		const channelRoom = CHANNEL_PREFIX + membership.channelId;
		io.to(channelRoom).emit(ChannelEvent.NEW_CHANNEL_MEMBERSHIP, membership);
		console.log(
			` Emit event[${ChannelEvent.NEW_CHANNEL_MEMBERSHIP}]`,
			membership
		);

		// emit to user for new channel
		const channel = await channelService.getChannelById(
			membership.channelId,
			true
		);
		io.to(USER_PREFFIX + membership.userId).emit(
			ChannelEvent.JOIN_NEW_CHANNEL,
			channel
		);
		console.log(` Emit event[${ChannelEvent.JOIN_NEW_CHANNEL}]`, channel);
	}
};

export default wrapErrorHandler(handler);
