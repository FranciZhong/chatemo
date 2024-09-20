import { BadRequestError, MethodNotAllowedError } from '@/server/error';
import { wrapErrorHandler } from '@/server/middleware';
import conversationService from '@/server/services/conversationService';
import { ConversationMessageZType } from '@/types/chat';
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

	const messages = await conversationService.getConversationMessages(
		referToId,
		skip,
		take
	);

	res.status(HttpStatusCode.Ok).json({
		data: messages,
	} as FormatResponse<ConversationMessageZType[]>);
};

export default wrapErrorHandler(handler);
