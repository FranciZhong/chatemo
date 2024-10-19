import {
	BadRequestError,
	MethodNotAllowedError,
	UnauthorizedError,
} from '@/server/error';
import { wrapErrorHandler } from '@/server/middleware';
import agentService from '@/server/services/agentService';
import userService from '@/server/services/userService';
import { FormatResponse } from '@/types/common';
import { AgentProfilePayloadSchema, AgentZType } from '@/types/llm';
import { HttpStatusCode } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'POST') {
		throw new MethodNotAllowedError();
	}

	const payload = AgentProfilePayloadSchema.parse(req.body);
	if (!payload) {
		throw new BadRequestError();
	}

	const token = await getToken({ req });
	if (!token || !token.sub) {
		throw new UnauthorizedError();
	}

	const userId = token.sub;

	const userConfig = await userService.getConfigById(userId);
	const agent = await agentService.create(userId, payload, {
		...userConfig.modelConfig,
		defaultModel: undefined,
	});

	res.status(HttpStatusCode.Ok).json({
		data: agent,
		message: 'Your new agent is ready!!',
	} as FormatResponse<AgentZType>);
};

export default wrapErrorHandler(handler);
