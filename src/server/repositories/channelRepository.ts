import { ChannelPayload } from '@/types/chat';
import { Prisma, PrismaClient, ValidStatus } from '@prisma/client';

const create = (
	prisma: PrismaClient | Prisma.TransactionClient,
	ownerId: string,
	{ type, name, description, image }: ChannelPayload
) => {
	return prisma.channel.create({
		data: {
			ownerId,
			type,
			name,
			description,
			image,
		},
	});
};

const selectByIds = (
	prisma: PrismaClient | Prisma.TransactionClient,
	channelIds: string[]
) => {
	return prisma.channel.findMany({
		where: {
			id: {
				in: channelIds,
			},
			valid: ValidStatus.VALID,
		},
		include: {
			memberships: {
				include: {
					user: true,
				},
			},
		},
	});
};

const channelRepository = { create, selectByIds };

export default channelRepository;
