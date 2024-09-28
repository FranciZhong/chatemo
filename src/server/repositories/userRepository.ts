import { ProfilePayload } from '@/types/user';
import { Prisma, PrismaClient } from '@prisma/client';
import { JsonObject } from '@prisma/client/runtime/library';

const selectById = (
	prisma: PrismaClient | Prisma.TransactionClient,
	id: string,
	includeFriendships?: boolean
) => {
	return prisma.user.findFirst({
		where: { id },
		include: {
			friendships: includeFriendships,
		},
	});
};

const selectByIds = (
	prisma: PrismaClient | Prisma.TransactionClient,
	ids: string[]
) => {
	return prisma.user.findMany({
		where: {
			id: {
				in: ids,
			},
		},
	});
};

const selectStartWithName = (
	prisma: PrismaClient | Prisma.TransactionClient,
	name: string,
	limit?: number
) => {
	return prisma.user.findMany({
		where: {
			name: {
				startsWith: name,
			},
		},
		take: limit,
	});
};

const updateProfile = (
	prisma: PrismaClient | Prisma.TransactionClient,
	id: string,
	{ name, image, description }: ProfilePayload
) => {
	return prisma.user.update({
		where: {
			id,
		},
		data: {
			name,
			image,
			description,
		},
	});
};

const updateConfig = (
	prisma: PrismaClient | Prisma.TransactionClient,
	id: string,
	config: JsonObject
) => {
	return prisma.user.update({
		where: {
			id,
		},
		data: {
			config,
		},
	});
};

const userRepository = {
	selectById,
	selectByIds,
	selectStartWithName,
	updateProfile,
	updateConfig,
};

export default userRepository;
