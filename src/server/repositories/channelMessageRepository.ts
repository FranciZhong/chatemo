import { ChannelMessagePayload } from '@/types/chat';
import { MessageType, Prisma, PrismaClient, ValidStatus } from '@prisma/client';

const create = (
	prisma: PrismaClient | Prisma.TransactionClient,
	senderId: string,
	type: MessageType,
	loading: boolean,
	{
		channelId,
		content,
		image,
		replyTo,
		provider,
		model,
		agentId,
	}: ChannelMessagePayload
) => {
	return prisma.channelMessage.create({
		data: {
			senderId,
			type,
			loading,
			channelId,
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
	content: string
) => {
	return prisma.channelMessage.update({
		where: {
			id,
		},
		data: {
			loading,
			content,
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
	return prisma.channelMessage.update({
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
	return prisma.channelMessage.findUnique({
		where: {
			id,
		},
	});
};

const selectByCreateAtOffset = (
	prisma: PrismaClient | Prisma.TransactionClient,
	channelId: string,
	createAt: Date,
	take: number
) => {
	return prisma.channelMessage.findMany({
		where: {
			channelId,
			createdAt: {
				lte: createAt,
			},
			valid: ValidStatus.VALID,
		},
		take,
		orderBy: {
			createdAt: 'desc',
		},
	});
};

const selectByChannelOffset = (
	prisma: PrismaClient | Prisma.TransactionClient,
	channelId: string,
	skip: number,
	take: number
) => {
	return prisma.channelMessage.findMany({
		where: {
			channelId,
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

const channelMessageRepository = {
	create,
	updateContentById,
	updateValidById,
	selectById,
	selectByCreateAtOffset,
	selectByChannelOffset,
};

export default channelMessageRepository;
