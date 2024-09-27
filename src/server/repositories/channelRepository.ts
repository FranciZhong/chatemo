import { ChannelPayload } from '@/types/chat';
import {
	AvailableType,
	Prisma,
	PrismaClient,
	ValidStatus,
} from '@prisma/client';

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
	channelIds: string[],
	includeMemberships: boolean
) => {
	return prisma.channel.findMany({
		where: {
			id: {
				in: channelIds,
			},
			valid: ValidStatus.VALID,
		},
		include: {
			memberships: includeMemberships && {
				where: {
					valid: ValidStatus.VALID,
				},
				include: {
					user: true,
				},
			},
		},
	});
};

const selectByNamePrefix = (
	prisma: PrismaClient | Prisma.TransactionClient,
	prefix: string
) => {
	return prisma.channel.findMany({
		where: {
			name: {
				startsWith: prefix,
			},
			type: AvailableType.PUBLIC,
			valid: ValidStatus.VALID,
		},
	});
};

const updateOwnerById = (
	prisma: PrismaClient | Prisma.TransactionClient,
	id: string,
	ownerId: string
) => {
	return prisma.channel.update({
		where: {
			id,
		},
		data: {
			ownerId,
		},
	});
};

const updateValidById = (
	prisma: PrismaClient | Prisma.TransactionClient,
	id: string,
	valid: ValidStatus
) => {
	return prisma.channel.update({
		where: {
			id,
		},
		data: {
			valid,
		},
	});
};

const channelRepository = {
	create,
	selectByIds,
	selectByNamePrefix,
	updateOwnerById,
	updateValidById,
};

export default channelRepository;
