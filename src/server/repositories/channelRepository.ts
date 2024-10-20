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

const selectByName = (
	prisma: PrismaClient | Prisma.TransactionClient,
	name: string
) => {
	return prisma.channel.findMany({
		where: {
			name: {
				contains: name,
				mode: 'insensitive',
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

const updateProfileById = (
	prisma: PrismaClient | Prisma.TransactionClient,
	id: string,
	{ type, name, image, description }: ChannelPayload
) => {
	return prisma.channel.update({
		where: {
			id,
		},
		data: { type, name, image, description },
	});
};

const channelRepository = {
	create,
	selectByIds,
	selectByName,
	updateOwnerById,
	updateValidById,
	updateProfileById,
};

export default channelRepository;
