import { Prisma, PrismaClient } from '@prisma/client';

const createMany = (
	prisma: PrismaClient | Prisma.TransactionClient,
	participantsData: { userId: string; conversationId: string }[]
) => {
	return prisma.conversationPartipant.createMany({
		data: participantsData,
	});
};

const participantRepository = { createMany };

export default participantRepository;
