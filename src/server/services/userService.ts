import {
	DEFAULT_SELECT_LIMIT,
	LlmProviderName,
	NotificationType,
} from '@/lib/constants';
import { prisma } from '@/server/db';
import { LlmProvider } from '@/types/llm';
import {
	FriendRequestSchema,
	FriendshipSchema,
	FriendshipZType,
	NotificationZType,
	ProfilePayload,
	UserConfigSchema,
	UserConfigZType,
	UserProfileSchema,
	UserSchema,
} from '@/types/user';
import { RequestStatus, ValidStatus } from '@prisma/client';
import { ConflictError, NotFoundError } from '../error';
import AuthropicProvider from '../gateways/providers/anthropicProvider';
import GeminiProvider from '../gateways/providers/geminiProvider';
import OpenAiProvider from '../gateways/providers/openAiProvider';
import channelRequestRepository from '../repositories/channelRequestRepository';
import conversationRepository from '../repositories/conversationRepository';
import friendRequestRepository from '../repositories/friendRequestRepository';
import friendshipRepository from '../repositories/friendshipRepository';
import participantRepository from '../repositories/participantRepository';
import userRepository from '../repositories/userRepository';

const getByIds = async (ids: string[]) => {
	const users = await userRepository.selectByIds(prisma, ids);

	return users.map((user) => UserSchema.parse(user));
};

const getProfileById = async (id: string) => {
	const user = await userRepository.selectById(prisma, id, true);
	if (!user) {
		throw new NotFoundError('No user found');
	}

	return UserProfileSchema.parse(user);
};

const getConfigById = async (id: string) => {
	const user = await userRepository.selectById(prisma, id, false);
	if (!user) {
		throw new NotFoundError('No user found');
	}

	return UserConfigSchema.parse(user.config);
};

const getNotificationsByUserId = async (userId: string) => {
	const friendRequests = await friendRequestRepository.selectByReceiverId(
		prisma,
		userId,
		RequestStatus.PENDING
	);

	const channelRequests = await channelRequestRepository.selectByReceiverId(
		prisma,
		userId,
		RequestStatus.PENDING
	);

	let notifications: NotificationZType[] = [];
	friendRequests
		.map(
			(request) =>
				({
					type: NotificationType.FRIEND_REQUEST,
					referToId: request.id,
					from: UserSchema.parse(request.sender),
					title: NotificationType.FRIEND_REQUEST,
					// todo description
				} as NotificationZType)
		)
		.forEach((notification) => notifications.push(notification));

	channelRequests
		.map(
			(request) =>
				({
					type: NotificationType.JOIN_CHANNEL_REQUEST,
					referToId: request.id,
					referTo: request,
					from: UserSchema.parse(request.sender),
					title: NotificationType.JOIN_CHANNEL_REQUEST,
				} as NotificationZType)
		)
		.forEach((notification) => notifications.push(notification));

	return notifications;
};

const getFriendRequestById = async (requestId: string) => {
	const request = await friendRequestRepository.selectById(prisma, requestId);

	return FriendRequestSchema.parse(request);
};

const getFriendshipsById = async (friendshipId: string) => {
	const userFriendship = await friendshipRepository.selectById(
		prisma,
		friendshipId
	);
	if (!userFriendship) {
		return [] as FriendshipZType[];
	}

	const friendFriendship = await friendshipRepository.selectByUserFriend(
		prisma,
		userFriendship.friendId,
		userFriendship.userId
	);

	return [
		FriendshipSchema.parse(userFriendship),
		FriendshipSchema.parse(friendFriendship),
	];
};

const searchByName = async (name: string) => {
	const users = await userRepository.selectByName(
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
	if (existFrienship?.valid === ValidStatus.VALID) {
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

const deleteConversation = async (conversationId: string) => {
	await prisma.$transaction(async (client) => {
		await conversationRepository.updateValidById(
			client,
			conversationId,
			ValidStatus.INVALID
		);
		await participantRepository.updateValidByConversationId(
			client,
			conversationId,
			ValidStatus.INVALID
		);
		await friendshipRepository.updateValidByConversationId(
			client,
			conversationId,
			ValidStatus.INVALID
		);
	});
};

const updateProfile = async (userId: string, payload: ProfilePayload) => {
	const user = await userRepository.updateProfile(prisma, userId, payload);

	return UserProfileSchema.parse(user);
};

const updateConfig = async (userId: string, config: UserConfigZType) => {
	const user = await userRepository.updateConfig(prisma, userId, config);

	return UserProfileSchema.parse(user);
};

const initProviders = async (userId: string) => {
	const providerMap = new Map<LlmProviderName, LlmProvider>();
	const user = await getProfileById(userId);
	const apiConfig = user.config?.apiConfig;
	if (apiConfig?.openaiApiKey && apiConfig.openaiApiKey.length > 0) {
		const openAiProvider = new OpenAiProvider(apiConfig.openaiApiKey);
		try {
			if (await openAiProvider.isAvailable()) {
				providerMap.set(LlmProviderName.OPENAI, openAiProvider);
			}
		} catch (error) {
			console.error(`User:${userId} fail to init openAiProvider`, error);
		}
	}

	if (apiConfig?.anthropicApiKey && apiConfig.anthropicApiKey.length > 0) {
		const anthropicProvider = new AuthropicProvider(apiConfig.anthropicApiKey);

		try {
			if (await anthropicProvider.isAvailable()) {
				providerMap.set(LlmProviderName.ANTHROPIC, anthropicProvider);
			}
		} catch (error) {
			console.error(`User:${userId} fail to init anthropicProvider`, error);
		}
	}

	if (apiConfig?.geminiApiKey && apiConfig.geminiApiKey.length > 0) {
		const gemeniProvider = new GeminiProvider(apiConfig.geminiApiKey);

		try {
			if (await gemeniProvider.isAvailable()) {
				providerMap.set(LlmProviderName.GEMINI, gemeniProvider);
			}
		} catch (error) {
			console.error(`User:${userId} fail to init gemeniProvider`, error);
		}
	}

	return providerMap;
};

const userService = {
	getByIds,
	getProfileById,
	getConfigById,
	getNotificationsByUserId,
	getFriendRequestById,
	getFriendshipsById,
	searchByName,
	sendFriendRequest,
	deleteConversation,
	updateProfile,
	updateConfig,
	initProviders,
};

export default userService;
