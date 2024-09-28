import { Prisma, PrismaClient, ValidStatus } from '@prisma/client';

const create = (
	prisma: PrismaClient | Prisma.TransactionClient,
	userId: string,
	channelId: string
) => {
	return prisma.channelMembership.upsert({
		where: {
			channelId_userId: {
				channelId,
				userId,
			},
		},
		update: {
			valid: ValidStatus.VALID,
		},
		create: {
			userId,
			channelId,
			valid: ValidStatus.VALID,
		},
		include: {
			user: true,
		},
	});
};

const selectById = (
	prisma: PrismaClient | Prisma.TransactionClient,
	id: string
) => {
	return prisma.channelMembership.findUnique({
		where: {
			id,
		},
	});
};

const selectByUserId = (
	prisma: PrismaClient | Prisma.TransactionClient,
	userId: string
) => {
	return prisma.channelMembership.findMany({
		where: {
			userId,
			valid: ValidStatus.VALID,
		},
	});
};

const selectByChannelUser = (
	prisma: PrismaClient | Prisma.TransactionClient,
	channelId: string,
	userId: string
) => {
	return prisma.channelMembership.findUnique({
		where: {
			channelId_userId: {
				channelId,
				userId,
			},
		},
	});
};

const updateValidById = (
	prisma: PrismaClient | Prisma.TransactionClient,
	id: string,
	valid: ValidStatus
) => {
	return prisma.channelMembership.update({
		where: {
			id,
		},
		data: {
			valid,
		},
	});
};

const updateValidByChannelId = (
	prisma: PrismaClient | Prisma.TransactionClient,
	channelId: string,
	valid: ValidStatus
) => {
	return prisma.channelMembership.updateMany({
		where: {
			channelId,
		},
		data: {
			valid,
		},
	});
};

const channelMembershipRepository = {
	create,
	selectById,
	selectByUserId,
	selectByChannelUser,
	updateValidById,
	updateValidByChannelId,
};

export default channelMembershipRepository;
