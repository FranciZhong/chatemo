import { Prisma, PrismaClient } from '@prisma/client';

const create = (
	prisma: PrismaClient | Prisma.TransactionClient,
	senderId: string,
	conversationId: string,
	content: string,
	replyTo?: string
) => {
	return prisma.message.create({
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
	return prisma.message.findMany({
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

const messageRepository = { create, selectByConversationOffset };

export default messageRepository;
