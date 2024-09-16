import { Prisma, PrismaClient, ValidStatus } from '@prisma/client';

const create = (
	prisma: PrismaClient | Prisma.TransactionClient,
	userId: string,
	channelId: string
) => {
	return prisma.channelMembership.create({
		data: {
			userId,
			channelId,
			valid: ValidStatus.VALID,
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

const channelMembershipRepository = { create, selectByUserId };

export default channelMembershipRepository;
