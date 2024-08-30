import { ConversationType, Prisma, PrismaClient } from '@prisma/client';

const create = (
	prisma: PrismaClient | Prisma.TransactionClient,
	type: ConversationType
) => {
	return prisma.conversation.create({
		data: {
			type,
		},
		select: {
			id: true,
		},
	});
};

const selectByIds = (
	prisma: PrismaClient | Prisma.TransactionClient,
	ids: string[],
	includePaticipants: boolean,
	includeFriendships: boolean
) => {
	return prisma.conversation.findMany({
		where: {
			id: {
				in: ids,
			},
		},
		include: {
			participants: includePaticipants,
			friendships: includeFriendships,
		},
	});
};

const conversationRepository = { create, selectByIds };

export default conversationRepository;
