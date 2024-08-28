import { DEFAULT_SELECT_LIMIT, NOTIFICATION_TYPE } from '@/app/constants';
import { prisma } from '@/lib/db';
import { NotificationZType, UserProfileSchema, UserSchema } from '@/types/user';
import { RequestStatus } from '@prisma/client';
import { ConflictError, NotFoundError } from '../error';
import friendRequestRepository from '../repositories/friendRequestRepository';
import userRepository from '../repositories/userRepository';

const getById = async (id: string) => {
	const user = await userRepository.selectById(id);
	if (!user) {
		throw new NotFoundError('No user found');
	}

	return UserProfileSchema.parse(user);
};

const getNotificationsByUserId = async (userId: string) => {
	const friendRequests = await friendRequestRepository.selectByReceiverId(
		userId,
		RequestStatus.PENDING
	);

	let notifications: NotificationZType[] = [];
	friendRequests
		.map((request) => ({
			type: NOTIFICATION_TYPE.FRIEND_REQUEST,
			referToId: request.id,
			from: UserSchema.parse(request.sender),
			title: NOTIFICATION_TYPE.FRIEND_REQUEST,
			// todo description
		}))
		.forEach((notification) => notifications.push(notification));

	return notifications;
};

const searchByName = async (name: string) => {
	const users = await userRepository.selectStartWithName(
		name,
		DEFAULT_SELECT_LIMIT
	);

	return users.map((user) => UserSchema.parse(user));
};

const sendFriendRequest = async (senderId: string, receiverId: string) => {
	if (senderId === receiverId) {
		throw new ConflictError("Can't to that to yourself");
	}

	const receiver = await userRepository.selectById(receiverId);
	if (!receiver) {
		throw new NotFoundError('User not found.');
	}

	await prisma.$transaction(async () => {
		const existPendingRequest = await friendRequestRepository.selectWithStatus(
			senderId,
			receiverId,
			RequestStatus.PENDING
		);
		if (!existPendingRequest) {
			await friendRequestRepository.create(senderId, receiverId);
		}
	});
};

const userService = {
	getById,
	getNotificationsByUserId,
	searchByName,
	sendFriendRequest,
};

export default userService;
