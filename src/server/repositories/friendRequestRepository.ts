import { Prisma, PrismaClient, RequestStatus } from '@prisma/client';

const create = (
	prisma: PrismaClient | Prisma.TransactionClient,
	senderId: string,
	receiverId: string
) => {
	return prisma.friendRequest.upsert({
		where: {
			senderId_receiverId: {
				senderId,
				receiverId,
			},
		},
		create: {
			senderId,
			receiverId,
			status: RequestStatus.PENDING,
		},
		update: {
			status: RequestStatus.PENDING,
		},
	});
};

const selectById = (
	prisma: PrismaClient | Prisma.TransactionClient,
	id: string
) => {
	return prisma.friendRequest.findUnique({
		where: {
			id,
		},
	});
};

const selectWithStatus = (
	prisma: PrismaClient | Prisma.TransactionClient,
	senderId: string,
	receiverId: string,
	status: RequestStatus
) => {
	return prisma.friendRequest.findFirst({
		where: {
			senderId,
			receiverId,
			status,
		},
	});
};

const selectByReceiverId = (
	prisma: PrismaClient | Prisma.TransactionClient,
	receiverId: string,
	status: RequestStatus
) => {
	return prisma.friendRequest.findMany({
		where: {
			receiverId,
			status,
		},
		include: {
			sender: true,
		},
	});
};

const updateStatusById = (
	prisma: PrismaClient | Prisma.TransactionClient,
	id: string,
	status: RequestStatus
) => {
	return prisma.friendRequest.update({
		data: {
			status,
		},
		where: {
			id,
		},
	});
};

const friendRequestRepository = {
	create,
	selectById,
	selectWithStatus,
	selectByReceiverId,
	updateStatusById,
};

export default friendRequestRepository;
