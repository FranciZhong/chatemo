import { prisma } from '@/server/db';
import { ConversationSchema } from '@/types/chat';
import { ConversationType, RequestStatus } from '@prisma/client';
import { ConflictError, ForbiddenError } from '../error';
import conversationRepository from '../repositories/conversationRepository';
import friendRequestRepository from '../repositories/friendRequestRepository';
import friendshipRepository from '../repositories/friendshipRepository';
import participantRepository from '../repositories/participantRepository';

const rejectRequest = async (requestId: string) => {
	await friendRequestRepository.updateStatusById(
		prisma,
		requestId,
		RequestStatus.REJECTED
	);
};

const buildFriendship = async (userId: string, requestId: string) => {
	const conversation = await prisma.$transaction(async (client) => {
		const request = await friendRequestRepository.selectById(client, requestId);

		if (!request || request.receiverId !== userId) {
			throw new ForbiddenError();
		}

		if (request.status === 'ACCEPTED') {
			throw new ConflictError();
		}

		await friendRequestRepository.updateStatusById(
			client,
			requestId,
			RequestStatus.ACCEPTED
		);

		const { id: conversationId } = await conversationRepository.create(
			client,
			ConversationType.DIRECT
		);

		await friendshipRepository.create(
			client,
			request.senderId,
			request.receiverId,
			conversationId
		);

		await friendshipRepository.create(
			client,
			request.receiverId,
			request.senderId,
			conversationId
		);

		await participantRepository.createMany(client, [
			{ userId: request.senderId, conversationId },
			{ userId: request.receiverId, conversationId },
		]);

		const conversations = await conversationRepository.selectByIds(
			client,
			[conversationId],
			true,
			true
		);

		return conversations[0];
	});

	return ConversationSchema.parse(conversation);
};

const friendService = { rejectRequest, buildFriendship };

export default friendService;
