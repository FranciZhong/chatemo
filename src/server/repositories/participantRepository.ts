import { Prisma, PrismaClient, ValidStatus } from '@prisma/client';

const createMany = (
	prisma: PrismaClient | Prisma.TransactionClient,
	participantsData: { userId: string; conversationId: string }[]
) => {
	return prisma.conversationPartipant.createMany({
		data: participantsData,
	});
};

const selectByUserId = (
	prisma: PrismaClient | Prisma.TransactionClient,
	userId: string
) => {
	return prisma.conversationPartipant.findMany({
		where: {
			userId,
			valid: ValidStatus.VALID,
		},
	});
};

const selectByConversationId = (
	prisma: PrismaClient | Prisma.TransactionClient,
	conversationId: string,
	includeUser: boolean
) => {
	return prisma.conversationPartipant.findMany({
		where: {
			conversationId,
			valid: ValidStatus.VALID,
		},
		include: {
			user: includeUser,
		},
	});
};

const updateValidByConversationId = (
	prisma: PrismaClient | Prisma.TransactionClient,
	conversationId: string,
	valid: ValidStatus
) => {
	return prisma.conversationPartipant.updateMany({
		where: {
			conversationId,
		},
		data: {
			valid,
		},
	});
};

const participantRepository = {
	createMany,
	selectByUserId,
	selectByConversationId,
	updateValidByConversationId,
};

export default participantRepository;
