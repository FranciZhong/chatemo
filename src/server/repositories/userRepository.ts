import { prisma } from '@/lib/db';

const getById = async (id: string) => {
	return prisma.user.findFirst({
		where: { id },
	});
};

const repository = {
	getById,
};

export default repository;
