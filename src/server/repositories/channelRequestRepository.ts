import {
	ChannelRequestType,
	Prisma,
	PrismaClient,
	RequestStatus,
} from '@prisma/client';

const create = (
	prisma: PrismaClient | Prisma.TransactionClient,
	type: ChannelRequestType,
	senderId: string,
	receiverId: string,
	channelId: string
) => {
	return prisma.channelRequest.create({
		data: {
			type,
			senderId,
			receiverId,
			channelId,
			status: RequestStatus.PENDING,
		},
		include: {
			channel: true,
		},
	});
};

const selectById = (
	prisma: PrismaClient | Prisma.TransactionClient,
	id: string
) => {
	return prisma.channelRequest.findUnique({
		where: {
			id,
		},
	});
};

const selectByReceiverId = (
	prisma: PrismaClient | Prisma.TransactionClient,
	receiverId: string,
	status: RequestStatus
) => {
	return prisma.channelRequest.findMany({
		where: {
			receiverId,
			status,
		},
		include: {
			sender: true,
			channel: true,
		},
	});
};

const selectByChannelSender = (
	prisma: PrismaClient | Prisma.TransactionClient,
	channelId: string,
	senderId: string,
	type: ChannelRequestType,
	status: RequestStatus
) => {
	return prisma.channelRequest.findFirst({
		where: {
			channelId,
			senderId,
			type,
			status,
		},
	});
};

const selectByChannelReceiver = (
	prisma: PrismaClient | Prisma.TransactionClient,
	channelId: string,
	receiverId: string,
	type: ChannelRequestType,
	status: RequestStatus
) => {
	return prisma.channelRequest.findFirst({
		where: {
			channelId,
			receiverId,
			type,
			status,
		},
	});
};

const uploadStatusById = (
	prisma: PrismaClient | Prisma.TransactionClient,
	id: string,
	status: RequestStatus
) => {
	return prisma.channelRequest.update({
		where: {
			id,
		},
		data: {
			status,
		},
	});
};

const channelRequestRepository = {
	create,
	selectById,
	selectByReceiverId,
	selectByChannelSender,
	selectByChannelReceiver,
	uploadStatusById,
};

export default channelRequestRepository;
