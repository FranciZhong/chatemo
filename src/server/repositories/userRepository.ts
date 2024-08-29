import { Prisma, PrismaClient } from '@prisma/client';

const selectById = (
	prisma: PrismaClient | Prisma.TransactionClient,
	id: string
) => {
	return prisma.user.findFirst({
		where: { id },
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

const userRepository = {
	selectById,
	selectByIds,
	selectStartWithName,
};

export default userRepository;
