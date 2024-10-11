import {
	BadRequestError,
	ForbiddenError,
	MethodNotAllowedError,
	UnauthorizedError,
} from '@/server/error';
import { wrapErrorHandler } from '@/server/middleware';
import channelService from '@/server/services/channelService';
import { ChannelZType, UpdateChannelPayloadSchema } from '@/types/chat';
import { FormatResponse } from '@/types/common';
import { HttpStatusCode } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'POST') {
		throw new MethodNotAllowedError();
	}

	const { success, data: payload } = UpdateChannelPayloadSchema.safeParse(
		req.body
	);
	if (!success) {
		throw new BadRequestError();
	}

	const token = await getToken({ req });
	if (!token || !token.sub) {
		throw new UnauthorizedError();
	}

	const userId = token.sub;
	const channel = await channelService.getChannelById(payload.channelId, false);
	if (channel.ownerId !== userId) {
		throw new ForbiddenError();
	}

	const updatedChannel = await channelService.updateChannelProfile(payload);

	res.status(HttpStatusCode.Ok).json({
		data: updatedChannel,
		message: `Channel profile is updated.`,
	} as FormatResponse<ChannelZType>);
};

export default wrapErrorHandler(handler);
