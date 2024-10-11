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
	image?: string,
	config?: JsonObject
) => {
	return prisma.agent.create({
		data: {
			userId,
			name,
			description,
			image,
			config,
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

const updateProfileById = (
	prisma: PrismaClient | Prisma.TransactionClient,
	id: string,
	name: string,
	image: string | null,
	description: string | null
) => {
	return prisma.agent.update({
		where: {
			id,
		},
		data: {
			name,
			image,
			description,
		},
	});
};

const updateConfigById = (
	prisma: PrismaClient | Prisma.TransactionClient,
	id: string,
	config: JsonObject
) => {
	return prisma.agent.update({
		where: {
			id,
		},
		data: {
			config,
		},
	});
};

const agentRepository = {
	create,
	selectById,
	selectByUserId,
	updateValidById,
	updateProfileById,
	updateConfigById,
};

export default agentRepository;
