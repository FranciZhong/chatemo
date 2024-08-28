import { prisma } from '@/lib/db';

const selectById = (id: string) => {
	return prisma.user.findFirst({
		where: { id },
	});
};

const selectStartWithName = (name: string, limit?: number) => {
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
	selectStartWithName,
};

export default userRepository;
