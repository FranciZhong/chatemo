import { prisma } from '@/lib/db';
import {
	BadRequestError,
	ForbiddenError,
	MethodNotAllowedError,
	UnauthorizedError,
} from '@/server/error';
import { wrapErrorHandler } from '@/server/middleware';
import agentPromptRepository from '@/server/repositories/agentPromptRepository';
import agentRepository from '@/server/repositories/agentRepository';
import { FormatResponse } from '@/types/common';
import { AgentPromptPayloadSchema, AgentSchema, AgentZType } from '@/types/llm';
import { ValidStatus } from '@prisma/client';
import { HttpStatusCode } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === 'POST') {
		handlePost(req, res);
	} else if (req.method === 'DELETE') {
		handleDelete(req, res);
	} else {
		throw new MethodNotAllowedError();
	}
};

const handlePost = async (req: NextApiRequest, res: NextApiResponse) => {
	const {
		success,
		data: payload,
		error,
	} = AgentPromptPayloadSchema.safeParse(req.body);

	if (!success) {
		throw new BadRequestError(error.message);
	}

	const token = await getToken({ req });
	if (!token) {
		throw new UnauthorizedError();
	}

	const userId = token.sub!;
	const agent = await agentRepository.selectById(
		prisma,
		payload.agentId,
		false
	);
	if (agent?.userId !== userId) {
		throw new ForbiddenError('No allowed to modify this agent.');
	}

	await agentPromptRepository.create(prisma, payload.agentId, payload.content);

	const prompts = await agentPromptRepository.selectByAgentId(
		prisma,
		payload.agentId
	);

	res.status(HttpStatusCode.Created).json({
		data: AgentSchema.parse({
			...agent,
			prompts,
		}),
	} as FormatResponse<AgentZType>);
};

const handleDelete = async (req: NextApiRequest, res: NextApiResponse) => {
	const { promptId } = req.query;
	if (!promptId || typeof promptId !== 'string') {
		throw new BadRequestError('No promptId given.');
	}

	const prompt = await agentPromptRepository.selectById(prisma, promptId, true);
	if (!prompt) {
		throw new BadRequestError();
	}

	const token = await getToken({ req });
	if (!token) {
		throw new UnauthorizedError();
	}

	const userId = token.sub!;
	const agent = await agentRepository.selectById(
		prisma,
		prompt?.agent.id,
		false
	);
	if (agent?.userId !== userId) {
		throw new ForbiddenError('No allowed to modify this agent.');
	}

	await agentPromptRepository.updateValid(
		prisma,
		promptId,
		ValidStatus.INVALID
	);

	const prompts = await agentPromptRepository.selectByAgentId(prisma, agent.id);

	res.status(HttpStatusCode.Ok).json({
		data: AgentSchema.parse({
			...agent,
			prompts,
		}),
	} as FormatResponse<AgentZType>);
};

export default wrapErrorHandler(handler);
