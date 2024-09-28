import { BadRequestError, MethodNotAllowedError } from '@/server/error';
import { wrapErrorHandler } from '@/server/middleware';
import channelService from '@/server/services/channelService';
import { ChannelMessageZType } from '@/types/chat';
import {
	FormatResponse,
	SkipTakeQuery,
	SkipTakeQuerySchema,
} from '@/types/common';
import { HttpStatusCode } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'GET') {
		throw new MethodNotAllowedError();
	}

	let query: SkipTakeQuery;
	try {
		query = SkipTakeQuerySchema.parse(req.query);
	} catch (error) {
		throw new BadRequestError();
	}

	const { referToId, skip, take } = query;

	const messages = await channelService.getChannelMessages(
		referToId,
		skip,
		take
	);

	res.status(HttpStatusCode.Ok).json({
		data: messages,
	} as FormatResponse<ChannelMessageZType[]>);
};

export default wrapErrorHandler(handler);
