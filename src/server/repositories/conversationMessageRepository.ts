import { ConversationMessagePayload } from '@/types/chat';
import { MessageType, Prisma, PrismaClient, ValidStatus } from '@prisma/client';

const create = (
	prisma: PrismaClient | Prisma.TransactionClient,
	senderId: string,
	type: MessageType,
	loading: boolean,
	{
		conversationId,
		content,
		image,
		replyTo,
		provider,
		model,
		agentId,
	}: ConversationMessagePayload
) => {
	return prisma.conversationMessage.create({
		data: {
			senderId,
			type,
			loading,
			conversationId,
			content,
			image,
			replyTo,
			provider,
			model,
			agentId,
			valid: ValidStatus.VALID,
		},
		include: {
			replyToMessage: true,
			agent: true,
		},
	});
};

const updateContentById = (
	prisma: PrismaClient | Prisma.TransactionClient,
	id: string,
	loading: boolean,
	content?: string,
	image?: string
) => {
	return prisma.conversationMessage.update({
		where: {
			id,
		},
		data: {
			loading,
			content,
			image,
		},
		include: {
			replyToMessage: true,
			agent: true,
		},
	});
};

const updateValidById = (
	prisma: PrismaClient | Prisma.TransactionClient,
	id: string,
	valid: ValidStatus
) => {
	return prisma.conversationMessage.update({
		where: {
			id,
		},
		data: {
			valid,
		},
	});
};

const selectById = (
	prisma: PrismaClient | Prisma.TransactionClient,
	id: string
) => {
	return prisma.conversationMessage.findUnique({
		where: {
			id,
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
			valid: ValidStatus.VALID,
		},
		skip,
		take,
		orderBy: {
			createdAt: 'desc',
		},
		include: {
			replyToMessage: true,
			agent: true,
		},
	});
};

const conversationMessageRepository = {
	create,
	updateContentById,
	updateValidById,
	selectById,
	selectByConversationOffset,
};

export default conversationMessageRepository;
