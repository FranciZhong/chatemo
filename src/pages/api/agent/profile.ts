import {
	BadRequestError,
	ForbiddenError,
	MethodNotAllowedError,
	UnauthorizedError,
} from '@/server/error';
import { wrapErrorHandler } from '@/server/middleware';
import agentService from '@/server/services/agentService';
import { FormatResponse } from '@/types/common';
import { AgentZType, UpdateAgentProfilePayloadSchema } from '@/types/llm';
import { HttpStatusCode } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'POST') {
		throw new MethodNotAllowedError();
	}

	const { success, data: payload } = UpdateAgentProfilePayloadSchema.safeParse(
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
	const agent = await agentService.getAgentById(payload.agentId);
	if (!agent || agent.userId !== userId) {
		throw new ForbiddenError();
	}

	const updatedAgent = await agentService.updateAgentProfile(payload);

	res.status(HttpStatusCode.Ok).json({
		data: updatedAgent,
		message: `Agent profile is updated.`,
	} as FormatResponse<AgentZType>);
};

export default wrapErrorHandler(handler);
