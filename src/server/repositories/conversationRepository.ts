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

const selectById = (
	prisma: PrismaClient | Prisma.TransactionClient,
	id: string,
	includePaticipants: boolean,
	includeFriendships: boolean
) => {
	return prisma.conversation.findUnique({
		where: {
			id,
		},
		include: {
			participants: includePaticipants,
			friendships: includeFriendships,
		},
	});
};

const conversationRepository = { create, selectById };

export default conversationRepository;
