import { DEFAULT_SELECT_LIMIT, NotificationType } from '@/lib/constants';
import { prisma } from '@/lib/db';
import {
	FriendRequestSchema,
	NotificationZType,
	UserProfileSchema,
	UserSchema,
} from '@/types/user';
import { RequestStatus, ValidStatus } from '@prisma/client';
import { ConflictError, NotFoundError } from '../error';
import friendRequestRepository from '../repositories/friendRequestRepository';
import friendshipRepository from '../repositories/friendshipRepository';
import userRepository from '../repositories/userRepository';

const getByIds = async (ids: string[]) => {
	const users = await userRepository.selectByIds(prisma, ids);

	return users.map((user) => UserSchema.parse(user));
};

const getProfileById = async (id: string) => {
	const user = await userRepository.selectById(prisma, id);
	if (!user) {
		throw new NotFoundError('No user found');
	}

	return UserProfileSchema.parse(user);
};

const getNotificationsByUserId = async (userId: string) => {
	const friendRequests = await friendRequestRepository.selectByReceiverId(
		prisma,
		userId,
		RequestStatus.PENDING
	);

	let notifications: NotificationZType[] = [];
	friendRequests
		.map((request) => ({
			type: NotificationType.FRIEND_REQUEST,
			referToId: request.id,
			from: UserSchema.parse(request.sender),
			title: NotificationType.FRIEND_REQUEST,
			// todo description
		}))
		.forEach((notification) => notifications.push(notification));

	return notifications;
};

const searchByName = async (name: string) => {
	const users = await userRepository.selectStartWithName(
		prisma,
		name,
		DEFAULT_SELECT_LIMIT
	);

	return users.map((user) => UserSchema.parse(user));
};

const sendFriendRequest = async (senderId: string, receiverId: string) => {
	if (senderId === receiverId) {
		throw new ConflictError("Can't to that to yourself");
	}

	const receiver = await userRepository.selectById(prisma, receiverId);
	if (!receiver) {
		throw new NotFoundError('User not found.');
	}

	const existFrienship = await friendshipRepository.selectByUserFriend(
		prisma,
		senderId,
		receiverId
	);
	if (existFrienship?.status === ValidStatus.VALID) {
		throw new ConflictError('This user is already your friend.');
	}

	const request = await prisma.$transaction(async (client) => {
		const existPendingRequest = await friendRequestRepository.selectWithStatus(
			client,
			senderId,
			receiverId,
			RequestStatus.PENDING
		);
		if (!existPendingRequest) {
			return await friendRequestRepository.create(client, senderId, receiverId);
		} else {
			return null;
		}
	});

	return request ? FriendRequestSchema.parse(request) : null;
};

const userService = {
	getByIds,
	getProfileById,
	getNotificationsByUserId,
	searchByName,
	sendFriendRequest,
};

export default userService;
