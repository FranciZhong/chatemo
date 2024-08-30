import { Prisma, PrismaClient } from '@prisma/client';

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
		},
	});
};

const participantRepository = { createMany, selectByUserId };

export default participantRepository;
