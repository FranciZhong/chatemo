import { Prisma, PrismaClient, ValidStatus } from '@prisma/client';

const create = (
	prisma: PrismaClient | Prisma.TransactionClient,
	agentId: string,
	content: string
) => {
	return prisma.agentPrompt.create({
		data: {
			agentId,
			content,
			valid: ValidStatus.VALID,
		},
	});
};

const selectById = (
	prisma: PrismaClient | Prisma.TransactionClient,
	id: string,
	includeAgent: boolean
) => {
	return prisma.agentPrompt.findUnique({
		where: {
			id,
		},
		include: {
			agent: includeAgent,
		},
	});
};

const selectByAgentId = (
	prisma: PrismaClient | Prisma.TransactionClient,
	agentId: string
) => {
	return prisma.agentPrompt.findMany({
		where: {
			agentId,
			valid: ValidStatus.VALID,
		},
	});
};

const updateValid = (
	prisma: PrismaClient | Prisma.TransactionClient,
	id: string,
	valid: ValidStatus
) => {
	return prisma.agentPrompt.update({
		where: {
			id,
		},
		data: {
			valid,
		},
	});
};

const agentPromptRepository = {
	create,
	selectById,
	selectByAgentId,
	updateValid,
};

export default agentPromptRepository;
