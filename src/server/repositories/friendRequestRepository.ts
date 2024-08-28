import { prisma } from '@/lib/db';
import { RequestStatus } from '@prisma/client';

const create = (senderId: string, receiverId: string) => {
	return prisma.friendRequest.create({
		data: {
			senderId,
			receiverId,
			status: RequestStatus.PENDING,
		},
	});
};

const selectWithStatus = (
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

const selectByReceiverId = (receiverId: string, status: RequestStatus) => {
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

const friendRequestRepository = {
	create,
	selectWithStatus,
	selectByReceiverId,
};

export default friendRequestRepository;
