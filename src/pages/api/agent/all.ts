import { MethodNotAllowedError, UnauthorizedError } from '@/server/error';
import { wrapErrorHandler } from '@/server/middleware';
import agentService from '@/server/services/agentService';
import { FormatResponse } from '@/types/common';
import { AgentZType } from '@/types/llm';
import { HttpStatusCode } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'GET') {
		throw new MethodNotAllowedError();
	}

	const token = await getToken({ req });
	if (!token) {
		throw new UnauthorizedError();
	}

	const userId = token.sub!;

	const agents = await agentService.getAllByUserId(userId);

	res.status(HttpStatusCode.Ok).json({
		data: agents,
	} as FormatResponse<AgentZType[]>);
};

export default wrapErrorHandler(handler);
