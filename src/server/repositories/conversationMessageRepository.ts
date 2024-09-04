import { Prisma, PrismaClient } from '@prisma/client';

const create = (
	prisma: PrismaClient | Prisma.TransactionClient,
	senderId: string,
	conversationId: string,
	content: string,
	replyTo?: string
) => {
	return prisma.conversationMessage.create({
		data: {
			senderId,
			conversationId,
			content,
			replyTo,
		},
		include: {
			replyToMessage: true,
		},
	});
};

const selectByConversationOffset = (
	prisma: PrismaClient | Prisma.TransactionClient,
	conversationId: string,
	skip: number,
	take: number
) => {
	return prisma.conversationMessage.findMany({
		where: {
			conversationId,
		},
		skip,
		take,
		orderBy: {
			createdAt: 'desc',
		},
		include: {
			replyToMessage: true,
		},
	});
};

const conversationMessageRepository = { create, selectByConversationOffset };

export default conversationMessageRepository;
