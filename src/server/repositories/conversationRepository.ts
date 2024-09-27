import {
	ConversationType,
	Prisma,
	PrismaClient,
	ValidStatus,
} from '@prisma/client';

const create = (
	prisma: PrismaClient | Prisma.TransactionClient,
	type: ConversationType
) => {
	return prisma.conversation.create({
		data: {
			type,
			valid: ValidStatus.VALID,
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
			valid: ValidStatus.VALID,
		},
		include: {
			participants: includePaticipants,
			friendships: includeFriendships,
		},
	});
};

const updateValidById = (
	prisma: PrismaClient | Prisma.TransactionClient,
	id: string,
	valid: ValidStatus
) => {
	return prisma.conversation.update({
		where: {
			id,
		},
		data: {
			valid,
		},
	});
};

const conversationRepository = { create, selectByIds, updateValidById };

export default conversationRepository;
