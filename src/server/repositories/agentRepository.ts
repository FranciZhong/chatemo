import { Prisma, PrismaClient, ValidStatus } from '@prisma/client';
import { JsonObject } from '@prisma/client/runtime/library';

const basicSelect = {
	id: true,
	createdAt: true,
	updatedAt: true,
	name: true,
	description: true,
	image: true,
	config: true,
	userId: true,
};

const create = (
	prisma: PrismaClient | Prisma.TransactionClient,
	userId: string,
	name: string,
	description?: string,
	image?: string
) => {
	return prisma.agent.create({
		data: {
			userId,
			name,
			description,
			image,
		},
	});
};

const selectById = (
	prisma: PrismaClient | Prisma.TransactionClient,
	id: string,
	includePrompts: boolean
) => {
	return prisma.agent.findUnique({
		where: {
			id,
		},
		include: {
			prompts: includePrompts && {
				where: {
					valid: ValidStatus.VALID,
				},
			},
		},
	});
};

const selectByUserId = (
	prisma: PrismaClient | Prisma.TransactionClient,
	userId: string,
	includePrompts: boolean
) => {
	return prisma.agent.findMany({
		where: {
			userId,
			valid: ValidStatus.VALID,
		},
		include: {
			prompts: includePrompts && {
				where: {
					valid: ValidStatus.VALID,
				},
			},
		},
	});
};

const updateValidById = (
	prisma: PrismaClient | Prisma.TransactionClient,
	id: string,
	valid: ValidStatus
) => {
	return prisma.agent.update({
		where: {
			id,
		},
		data: {
			valid,
		},
	});
};

const updateConfigById = (
	prisma: PrismaClient | Prisma.TransactionClient,
	id: string,
	config: JsonObject,
	includePrompts: boolean
) => {
	return prisma.agent.update({
		where: {
			id,
		},
		data: {
			config,
		},
		include: {
			prompts: includePrompts && {
				where: {
					valid: ValidStatus.VALID,
				},
			},
		},
	});
};

const agentRepository = {
	create,
	selectById,
	selectByUserId,
	updateValidById,
	updateConfigById,
};

export default agentRepository;
