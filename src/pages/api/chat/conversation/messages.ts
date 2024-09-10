import { BadRequestError, MethodNotAllowedError } from '@/server/error';
import { wrapErrorHandler } from '@/server/middleware';
import conversationService from '@/server/services/conversationService';
import { MessageZType } from '@/types/chat';
import { FormatResponse } from '@/types/common';
import { HttpStatusCode } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'GET') {
		throw new MethodNotAllowedError();
	}

	let conversationId: string;
	let skipNum: number;
	let takeNum: number;

	try {
		conversationId = req.query.conversationId as string;
		const { skip, take } = req.query;
		if (!conversationId || !skip || !take) {
			throw new BadRequestError();
		}

		skipNum = parseInt(skip as string);
		takeNum = parseInt(take as string);
	} catch (error) {
		throw new BadRequestError();
	}

	const messages = await conversationService.getConversationMessages(
		conversationId,
		skipNum,
		takeNum
	);

	res.status(HttpStatusCode.Ok).json({
		data: messages,
	} as FormatResponse<MessageZType[]>);
};

export default wrapErrorHandler(handler);
