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
			valid: ValidStatus.VALID,
		},
		update: {
			conversationId,
			valid: ValidStatus.VALID,
		},
	});
};

const selectById = (
	prisma: PrismaClient | Prisma.TransactionClient,
	id: string
) => {
	return prisma.friendship.findUnique({
		where: {
			id,
		},
	});
};

const selectByUserFriend = (
	prisma: PrismaClient | Prisma.TransactionClient,
	userId: string,
	friendId: string
) => {
	return prisma.friendship.findUnique({
		where: {
			userId_friendId: {
				userId,
				friendId,
			},
		},
	});
};

const updateValidByConversationId = (
	prisma: PrismaClient | Prisma.TransactionClient,
	conversationId: string,
	valid: ValidStatus
) => {
	return prisma.friendship.updateMany({
		where: {
			conversationId,
		},
		data: {
			valid,
		},
	});
};

const friendshipRepository = {
	create,
	selectById,
	selectByUserFriend,
	updateValidByConversationId,
};

export default friendshipRepository;
