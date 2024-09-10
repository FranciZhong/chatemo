import { prisma } from '@/lib/db';
import { AgentProfilePayload, AgentSchema } from '@/types/llm';
import agentRepository from '../repositories/agentRepository';

const create = async (
	userId: string,
	{ name, description, image }: AgentProfilePayload
) => {
	const agent = await agentRepository.create(
		prisma,
		userId,
		name,
		description,
		image
	);

	return AgentSchema.parse(agent);
};

const getAllByUserId = async (userId: string) => {
	const agents = await agentRepository.selectByUserId(prisma, userId, true);

	return agents.map((item) => AgentSchema.parse(item));
};

const getWithPromptsById = async (agentId: string) => {
	const agent = await agentRepository.selectById(prisma, agentId, true);

	return AgentSchema.parse(agent);
};

const agentService = { create, getAllByUserId, getWithPromptsById };

export default agentService;
