import { prisma } from '@/server/db';
import {
	ChannelMembershipSchema,
	ChannelMessagePayload,
	ChannelMessageSchema,
	ChannelPayload,
	ChannelRequestSchema,
	ChannelSchema,
	MessageTypeZType,
	UpdateChannelPayload,
} from '@/types/chat';
import { ChannelRequestType, RequestStatus, ValidStatus } from '@prisma/client';
import { ConflictError, NotFoundError } from '../error';
import channelMembershipRepository from '../repositories/channelMembershipRepository';
import channelMessageRepository from '../repositories/channelMessageRepository';
import channelRepository from '../repositories/channelRepository';
import channelRequestRepository from '../repositories/channelRequestRepository';

const createChannel = async (userId: string, payload: ChannelPayload) => {
	const [channel, membership] = await prisma.$transaction(async (client) => {
		const channel = await channelRepository.create(client, userId, payload);

		const membership = await channelMembershipRepository.create(
			client,
			userId,
			channel.id
		);

		return [channel, membership];
	});

	return ChannelSchema.parse({
		...channel,
		memberships: [membership],
	});
};

const createJoinRequest = async (
	senderId: string,
	receiverId: string,
	channelId: string
) => {
	const existRequest = await channelRequestRepository.selectByChannelSender(
		prisma,
		channelId,
		senderId,
		ChannelRequestType.JOIN,
		RequestStatus.PENDING
	);

	if (existRequest) {
		return null;
	}

	const request = await channelRequestRepository.create(
		prisma,
		ChannelRequestType.JOIN,
		senderId,
		receiverId,
		channelId
	);

	return ChannelRequestSchema.parse(request);
};

const createInviteRequest = async (
	senderId: string,
	receiverId: string,
	channelId: string
) => {
	const existRequest = await channelRequestRepository.selectByChannelReceiver(
		prisma,
		channelId,
		receiverId,
		ChannelRequestType.INVITE,
		RequestStatus.PENDING
	);

	if (existRequest) {
		throw new ConflictError('A request is already sent.');
	}

	const request = await channelRequestRepository.create(
		prisma,
		ChannelRequestType.INVITE,
		senderId,
		receiverId,
		channelId
	);

	return ChannelRequestSchema.parse(request);
};

const createMessage = async (
	senderId: string,
	type: MessageTypeZType,
	loading: boolean,
	payload: ChannelMessagePayload
) => {
	const message = await channelMessageRepository.create(
		prisma,
		senderId,
		type,
		loading,
		payload
	);

	return ChannelMessageSchema.parse(message);
};

const getChannelsByUserId = async (userId: string) => {
	const memberships = await channelMembershipRepository.selectByUserId(
		prisma,
		userId
	);

	const channelIds = memberships.map((item) => item.channelId);
	const channels = await channelRepository.selectByIds(
		prisma,
		channelIds,
		true
	);

	return channels.map((channel) => ChannelSchema.parse(channel));
};

const getChannelById = async (
	channelId: string,
	includeMemberships: boolean
) => {
	const channels = await channelRepository.selectByIds(
		prisma,
		[channelId],
		includeMemberships
	);

	if (channels.length === 0) {
		throw new NotFoundError('Channel not found.');
	}

	return ChannelSchema.parse(channels.at(0));
};

const searchByName = async (name: string) => {
	const channels = await channelRepository.selectByName(prisma, name);

	return channels.map((item) => ChannelSchema.parse(item));
};

const getMembershipByChannelUser = async (
	channelId: string,
	userId: string
) => {
	const membership = await channelMembershipRepository.selectByChannelUser(
		prisma,
		channelId,
		userId
	);

	return membership ? ChannelMembershipSchema.parse(membership) : null;
};

const getChannelMessages = async (
	channelId: string,
	skip: number,
	take: number
) => {
	const messages = await channelMessageRepository.selectByChannelOffset(
		prisma,
		channelId,
		skip,
		take
	);

	return messages.map((item) => ChannelMessageSchema.parse(item));
};

const getMessageById = async (messageId: string) => {
	const message = await channelMessageRepository.selectById(prisma, messageId);

	return message ? ChannelMessageSchema.parse(message) : null;
};

const getMessageHistory = async (
	channelId: string,
	from: Date,
	take: number
) => {
	const messages = await channelMessageRepository.selectByCreateAtOffset(
		prisma,
		channelId,
		from,
		take
	);

	return messages.map((item) => ChannelMessageSchema.parse(item));
};

const getChannelRequestById = async (requestId: string) => {
	const request = await channelRequestRepository.selectById(prisma, requestId);

	return request ? ChannelRequestSchema.parse(request) : request;
};

const getMembershipById = async (membershipId: string) => {
	const membership = await channelMembershipRepository.selectById(
		prisma,
		membershipId
	);

	return membership ? ChannelMembershipSchema.parse(membership) : null;
};

const updateChannelProfile = async (payload: UpdateChannelPayload) => {
	const channel = await channelRepository.updateProfileById(
		prisma,
		payload.channelId,
		payload
	);

	return ChannelSchema.parse(channel);
};

const closeChannel = async (channelId: string) => {
	await prisma.$transaction(async (client) => {
		await channelRepository.updateValidById(
			client,
			channelId,
			ValidStatus.INVALID
		);
		await channelMembershipRepository.updateValidByChannelId(
			client,
			channelId,
			ValidStatus.INVALID
		);
	});
};

const updateMessageContent = async (
	messageId: string,
	loading: boolean,
	content?: string,
	image?: string
) => {
	const message = await channelMessageRepository.updateContentById(
		prisma,
		messageId,
		loading,
		content,
		image
	);

	return message ? ChannelMessageSchema.parse(message) : null;
};

const rejectRequest = async (requestId: string) => {
	await channelRequestRepository.uploadStatusById(
		prisma,
		requestId,
		RequestStatus.REJECTED
	);
};

const buildMembership = async (requestId: string) => {
	const membership = await prisma.$transaction(async (client) => {
		const request = await channelRequestRepository.uploadStatusById(
			client,
			requestId,
			RequestStatus.ACCEPTED
		);

		const memberId =
			request.type === 'JOIN' ? request.senderId : request.receiverId;

		const membership = await channelMembershipRepository.create(
			client,
			memberId,
			request.channelId
		);

		return membership;
	});

	return ChannelMembershipSchema.parse(membership);
};

const removeMembershipById = async (membershipId: string) => {
	await channelMembershipRepository.updateValidById(
		prisma,
		membershipId,
		ValidStatus.INVALID
	);
};

const assignOwnership = async (channelId: string, ownerId: string) => {
	await channelRepository.updateOwnerById(prisma, channelId, ownerId);
};

const deleteMessage = async (messageId: string) => {
	await channelMessageRepository.updateValidById(
		prisma,
		messageId,
		ValidStatus.INVALID
	);
};

const channelService = {
	createChannel,
	createJoinRequest,
	createInviteRequest,
	createMessage,
	getChannelsByUserId,
	getChannelById,
	searchByName,
	getMembershipByChannelUser,
	getChannelMessages,
	getMessageById,
	getMessageHistory,
	getChannelRequestById,
	getMembershipById,
	updateChannelProfile,
	closeChannel,
	updateMessageContent,
	rejectRequest,
	buildMembership,
	removeMembershipById,
	assignOwnership,
	deleteMessage,
};

export default channelService;
