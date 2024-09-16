import { BadRequestError, MethodNotAllowedError } from '@/server/error';
import { wrapErrorHandler } from '@/server/middleware';
import channelService from '@/server/services/channelService';
import { ChannelMessageZType } from '@/types/chat';
import { FormatResponse } from '@/types/common';
import { HttpStatusCode } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'GET') {
		throw new MethodNotAllowedError();
	}

	let channelId: string;
	let skipNum: number;
	let takeNum: number;

	try {
		channelId = req.query.channelId as string;
		const { skip, take } = req.query;
		if (!channelId || !skip || !take) {
			throw new BadRequestError();
		}

		skipNum = parseInt(skip as string);
		takeNum = parseInt(take as string);
	} catch (error) {
		throw new BadRequestError();
	}

	const messages = await channelService.getChannelMessages(
		channelId,
		skipNum,
		takeNum
	);

	res.status(HttpStatusCode.Ok).json({
		data: messages,
	} as FormatResponse<ChannelMessageZType[]>);
};

export default wrapErrorHandler(handler);
