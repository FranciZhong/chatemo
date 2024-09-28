import {
	BadRequestError,
	MethodNotAllowedError,
	UnauthorizedError,
} from '@/server/error';
import { wrapErrorHandler } from '@/server/middleware';
import channelService from '@/server/services/channelService';
import { ChannelPayloadSchema, ChannelZType } from '@/types/chat';
import { FormatResponse } from '@/types/common';
import { HttpStatusCode } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'POST') {
		throw new MethodNotAllowedError();
	}

	const payload = ChannelPayloadSchema.parse(req.body);
	if (!payload) {
		throw new BadRequestError();
	}

	const token = await getToken({ req });
	if (!token) {
		throw new UnauthorizedError();
	}

	const userId = token.sub!;
	const channel = await channelService.createChannel(userId, payload);

	res.status(HttpStatusCode.Ok).json({
		data: channel,
		message: 'Your new channel is ready!!',
	} as FormatResponse<ChannelZType>);
};

export default wrapErrorHandler(handler);
