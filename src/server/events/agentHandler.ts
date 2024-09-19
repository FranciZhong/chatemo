import { TAKE_MESSAGES_DEFAULT } from '@/lib/constants';
import { AgentEvent, ChannelEvent, ConversationEvent } from '@/lib/events';
import { convertPrompt2LlmMessage } from '@/lib/utils';
import { AgentReplyPayload, LlmMessageZType, LlmProvider } from '@/types/llm';
import { Server, Socket } from 'socket.io';
import { CHANNEL_PREFIX, USER_PREFFIX } from '.';
import { BadRequestError, ForbiddenError } from '../error';
import { wrapSocketErrorHandler } from '../middleware';
import agentService from '../services/agentService';
import channelService from '../services/channelService';
import conversationService from '../services/conversationService';
import userService from '../services/userService';

const agentHandler = (io: Server, socket: Socket) => {
	wrapSocketErrorHandler(
		socket,
		AgentEvent.AGENT_REPLY_CONVERSATION,
		async (payload: AgentReplyPayload) => {
			const userId = socket.data.session.id as string;
			const replyToMessage = await conversationService.getMessageById(
				payload.replyTo
			);

			const provider: LlmProvider = await getProvider(socket, userId, payload);

			// emit pending message
			const newMessage = await conversationService.createMessage(
				userId,
				'MODEL',
				true,
				{
					...payload,
					conversationId: replyToMessage.conversationId,
					content: '',
				}
			);

			const participants =
				await conversationService.getParticipantsByConversationId(
					replyToMessage.conversationId
				);

			const participantRooms = participants.map(
				(item) => USER_PREFFIX + item.userId
			);

			io.to(participantRooms).emit(
				ConversationEvent.NEW_CONVERSATION_MESSAGE,
				newMessage
			);

			// todo handle error and update message
			let inputMessages = await initLlmInputMessages(userId, payload);

			inputMessages = [
				...inputMessages,
				{
					role: 'user',
					content: replyToMessage.content,
				},
			];
			const llmMessage = await provider.completeMessage(
				payload.model,
				inputMessages
			);

			const updatedMessage = await conversationService.updateMessageContent(
				newMessage.id,
				false,
				llmMessage.content
			);

			io.to(participantRooms).emit(
				ConversationEvent.UPDATE_CONVERSATION_MESSAGE,
				updatedMessage
			);
		}
	);

	wrapSocketErrorHandler(
		socket,
		AgentEvent.AGENT_REPLY_CHANNEL,
		async (payload: AgentReplyPayload) => {
			const userId = socket.data.session.id as string;
			const replyToMessage = await channelService.getMessageById(
				payload.replyTo
			);

			const provider: LlmProvider = await getProvider(socket, userId, payload);

			// emit pending message
			const newMessage = await channelService.createMessage(
				userId,
				'MODEL',
				true,
				{
					...payload,
					channelId: replyToMessage.channelId,
					content: '',
				}
			);

			const channelRoom = CHANNEL_PREFIX + newMessage.channelId;
			io.to(channelRoom).emit(ChannelEvent.NEW_CHANNEL_MESSAGE, newMessage);

			let inputMessages = await initLlmInputMessages(userId, payload);

			const historyMessages = await channelService.getMessageHistory(
				replyToMessage.channelId,
				replyToMessage.createdAt,
				TAKE_MESSAGES_DEFAULT
			);

			inputMessages = [
				...inputMessages,
				...historyMessages.reverse().map(
					(item) =>
						({
							role: 'user',
							content: item.content,
						} as LlmMessageZType)
				),
			];
			const llmMessage = await provider.completeMessage(
				payload.model,
				inputMessages
			);

			const updatedMessage = await channelService.updateMessageContent(
				newMessage.id,
				false,
				llmMessage.content
			);

			io.to(channelRoom).emit(
				ChannelEvent.UPDATE_CHANNEL_MESSAGE,
				updatedMessage
			);
		}
	);
};

export default agentHandler;

async function getProvider(
	socket: Socket,
	userId: string,
	payload: AgentReplyPayload
) {
	if (!socket.data.providerMap) {
		socket.data.providerMap = await userService.initProviders(userId);
	}

	const provider: LlmProvider = socket.data.providerMap.get(payload.provider);

	if (!provider) {
		throw new ForbiddenError('Please provide a valid api key to continue.');
	}

	return provider;
}

async function initLlmInputMessages(
	userId: string,
	payload: AgentReplyPayload
) {
	let inputMessages = [] as LlmMessageZType[];
	if (payload.agentId) {
		const agent = await agentService.getWithPromptsById(payload.agentId);

		if (!agent || agent.userId !== userId) {
			throw new BadRequestError();
		}

		if (agent.prompts) {
			inputMessages = agent.prompts?.map((item) =>
				convertPrompt2LlmMessage(item)
			);
		}
	}
	return inputMessages;
}
