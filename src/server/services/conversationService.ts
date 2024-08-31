import { prisma } from '@/lib/db';
import {
	ConversationMessagePayload,
	ConversationSchema,
	MessageWithReplySchema,
	ParticipantSchema,
} from '@/types/chat';
import { UserSchema } from '@/types/user';
import { User } from '@prisma/client';
import { NotFoundError } from '../error';
import conversationRepository from '../repositories/conversationRepository';
import messageRepository from '../repositories/messageRepository';
import participantRepository from '../repositories/participantRepository';
import userRepository from '../repositories/userRepository';

const getConversationsByUserId = async (userId: string) => {
	const participantTo = await participantRepository.selectByUserId(
		prisma,
		userId
	);

	const conversationIds = participantTo.map((item) => item.conversationId);
	const conversations = await conversationRepository.selectByIds(
		prisma,
		conversationIds,
		true,
		true
	);

	const parsedConversations = conversations.map((item) =>
		ConversationSchema.parse(item)
	);

	let participantIdSet = new Set<string>();
	conversations
		.map((conversation) => conversation.participants)
		.filter((participants) => participants?.length > 0)
		.forEach((participants) =>
			participants.forEach((item) => participantIdSet.add(item.userId))
		);

	const users = await userRepository.selectByIds(
		prisma,
		Array.from(participantIdSet)
	);
	const id2UserMap = users.reduce((map, user) => {
		map.set(user.id, user);
		return map;
	}, new Map<String, User>());

	parsedConversations.forEach((conversation) =>
		conversation.participants.forEach(
			(participant) =>
				(participant.user = UserSchema.parse(
					id2UserMap.get(participant.userId)
				))
		)
	);

	return parsedConversations;
};

const getConversationWithParticipants = async (conversationId: string) => {
	const conversations = await conversationRepository.selectByIds(
		prisma,
		[conversationId],
		false,
		false
	);

	if (conversations.length === 0) {
		throw new NotFoundError('Conversation not found.');
	}

	const participants = await participantRepository.selectByConversationId(
		prisma,
		conversationId,
		true
	);

	return ConversationSchema.parse({
		...conversations.at(0),
		participants: participants,
	});
};

const getParticipantsByConversationId = async (conversationId: string) => {
	const participants = await participantRepository.selectByConversationId(
		prisma,
		conversationId,
		false
	);

	return participants.map((item) => ParticipantSchema.parse(item));
};

const getConversationMessages = async (
	conversationId: string,
	skip: number,
	take: number
) => {
	const messages = await messageRepository.selectByConversationOffset(
		prisma,
		conversationId,
		skip,
		take
	);

	return messages.map((item) => MessageWithReplySchema.parse(item));
};

const createMessage = async (
	senderId: string,
	payload: ConversationMessagePayload
) => {
	const { conversationId, content, replyTo } = payload;

	const message = await messageRepository.create(
		prisma,
		senderId,
		conversationId,
		content,
		replyTo
	);

	return MessageWithReplySchema.parse(message);
};

const conversationService = {
	getConversationsByUserId,
	getConversationWithParticipants,
	getParticipantsByConversationId,
	getConversationMessages,
	createMessage,
};

export default conversationService;
