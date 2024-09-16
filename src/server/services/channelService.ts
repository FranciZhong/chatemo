import { prisma } from '@/lib/db';
import {
	ChannelMessagePayload,
	ChannelMessageSchema,
	ChannelPayload,
	ChannelSchema,
	MessageTypeZType,
} from '@/types/chat';
import { ValidStatus } from '@prisma/client';
import { NotFoundError } from '../error';
import channelMembershipRepository from '../repositories/channelMembershipRepository';
import channelMessageRepository from '../repositories/channelMessageRepository';
import channelRepository from '../repositories/channelRepository';

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
	const channels = await channelRepository.selectByIds(prisma, channelIds);

	return channels.map((channel) => ChannelSchema.parse(channel));
};

const getChannelById = async (channelId: string) => {
	const channels = await channelRepository.selectByIds(prisma, [channelId]);

	if (channels.length === 0) {
		throw new NotFoundError('Channel not found.');
	}

	return ChannelSchema.parse(channels.at(0));
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

	return ChannelMessageSchema.parse(message);
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

const updateMessageContent = async (
	messageId: string,
	loading: boolean,
	content: string
) => {
	const message = await channelMessageRepository.updateContentById(
		prisma,
		messageId,
		loading,
		content
	);

	return ChannelMessageSchema.parse(message);
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
	createMessage,
	getChannelsByUserId,
	getChannelById,
	getChannelMessages,
	getMessageById,
	getMessageHistory,
	updateMessageContent,
	deleteMessage,
};

export default channelService;
