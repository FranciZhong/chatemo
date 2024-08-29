import { Prisma, PrismaClient, ValidStatus } from '@prisma/client';

const create = (
	prisma: PrismaClient | Prisma.TransactionClient,
	userId: string,
	friendId: string,
	conversationId: string
) => {
	return prisma.friendship.upsert({
		where: {
			userId_friendId: {
				userId,
				friendId,
			},
		},
		create: {
			userId,
			friendId,
			conversationId,
			status: ValidStatus.VALID,
		},
		update: {
			conversationId,
			status: ValidStatus.VALID,
		},
	});
};

const friendshipRepository = {
	create,
};

export default friendshipRepository;
