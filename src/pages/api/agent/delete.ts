import {
	BadRequestError,
	ForbiddenError,
	MethodNotAllowedError,
	UnauthorizedError,
} from '@/server/error';
import { wrapErrorHandler } from '@/server/middleware';
import agentService from '@/server/services/agentService';
import { FormatResponse, IdPayloadSchema } from '@/types/common';
import { HttpStatusCode } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'POST') {
		throw new MethodNotAllowedError();
	}

	const { success, data: payload } = IdPayloadSchema.safeParse(req.body);
	if (!success) {
		throw new BadRequestError();
	}

	const token = await getToken({ req });
	if (!token || !token.sub) {
		throw new UnauthorizedError();
	}

	const userId = token.sub;
	const agent = await agentService.getAgentById(payload.referToId);
	if (!agent || agent.userId !== userId) {
		throw new ForbiddenError();
	}

	await agentService.removeAgentById(payload.referToId);

	res.status(HttpStatusCode.Ok).json({
		message: `Your agent ${agent?.name} is removed.`,
	} as FormatResponse<undefined>);
};

export default wrapErrorHandler(handler);
