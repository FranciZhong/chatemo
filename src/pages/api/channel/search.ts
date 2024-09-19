import { BadRequestError, MethodNotAllowedError } from '@/server/error';
import { wrapErrorHandler } from '@/server/middleware';
import channelService from '@/server/services/channelService';
import { ChannelZType } from '@/types/chat';
import { FormatResponse } from '@/types/common';
import { HttpStatusCode } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'GET') {
		throw new MethodNotAllowedError();
	}

	let name = req.query.name as string;
	if (!name) {
		throw new BadRequestError();
	}

	const channels = await channelService.getChannelByNamePrefix(name);

	res.status(HttpStatusCode.Ok).json({
		data: channels,
	} as FormatResponse<ChannelZType[]>);
};

export default wrapErrorHandler(handler);
