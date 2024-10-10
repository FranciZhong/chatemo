import { prisma } from '@/server/db';
import {
	AgentProfilePayload,
	AgentSchema,
	ModelConfigZType,
} from '@/types/llm';
import { ValidStatus } from '@prisma/client';
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

const getAgentById = async (agentId: string) => {
	const agent = await agentRepository.selectById(prisma, agentId, false);

	return agent ? AgentSchema.parse(agent) : null;
};

const getAllByUserId = async (userId: string) => {
	const agents = await agentRepository.selectByUserId(prisma, userId, true);

	return agents.map((item) => AgentSchema.parse(item));
};

const getWithPromptsById = async (agentId: string) => {
	const agent = await agentRepository.selectById(prisma, agentId, true);

	return agent ? AgentSchema.parse(agent) : null;
};

const updateConfigByAgentId = async (
	agentId: string,
	config: ModelConfigZType
) => {
	const agent = await agentRepository.updateConfigById(
		prisma,
		agentId,
		config,
		true
	);

	return AgentSchema.parse(agent);
};

const removeAgentById = async (agentId: string) => {
	await agentRepository.updateValidById(prisma, agentId, ValidStatus.INVALID);
};

const agentService = {
	create,
	getAgentById,
	getAllByUserId,
	getWithPromptsById,
	updateConfigByAgentId,
	removeAgentById,
};

export default agentService;
