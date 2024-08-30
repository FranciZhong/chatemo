import { prisma } from '@/lib/db';
import { ConversationSchema } from '@/types/chat';
import { UserSchema } from '@/types/user';
import { User } from '@prisma/client';
import conversationRepository from '../repositories/conversationRepository';
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

const conversationService = { getConversationsByUserId };

export default conversationService;
