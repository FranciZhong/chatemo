import { LlmRole, TAKE_MESSAGES_DEFAULT } from '@/lib/constants';
import { AgentEvent, ChannelEvent, ConversationEvent } from '@/lib/events';
import { convertPrompt2LlmMessage } from '@/lib/utils';
import {
	AgentPreviewPayload,
	AgentReplyPayload,
	LlmMessageZType,
	LlmModelZType,
	LlmProvider,
	ModelParamsZType,
	StreamMessagePayload,
} from '@/types/llm';
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
			if (!replyToMessage || replyToMessage.valid !== 'VALID') {
				throw new BadRequestError('Message not found.');
			}

			let [model, params, inputMessages] = await initLlmInput(userId, payload);

			const provider: LlmProvider = await getProvider(
				socket,
				userId,
				model.provider
			);

			// emit pending message
			const newMessage = await conversationService.createMessage(
				userId,
				'MODEL',
				true,
				{
					...payload,
					// might override payload if using agent
					model: model.model,
					provider: model.provider,
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

			inputMessages = [
				...inputMessages,
				{
					role: LlmRole.USER,
					content: replyToMessage.content,
				},
			];
			const llmMessage = await provider.completeMessage(
				model.model,
				inputMessages,
				params
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

			if (!replyToMessage || replyToMessage.valid !== 'VALID') {
				throw new BadRequestError('Message not found.');
			}

			let [model, params, inputMessages] = await initLlmInput(userId, payload);

			const provider: LlmProvider = await getProvider(
				socket,
				userId,
				model.provider
			);

			// emit pending message
			const newMessage = await channelService.createMessage(
				userId,
				'MODEL',
				true,
				{
					...payload,
					// might override payload if using agent
					model: model.model,
					provider: model.provider,
					channelId: replyToMessage.channelId,
					content: '',
				}
			);

			const channelRoom = CHANNEL_PREFIX + newMessage.channelId;
			io.to(channelRoom).emit(ChannelEvent.NEW_CHANNEL_MESSAGE, newMessage);

			const historyMessages = await channelService.getMessageHistory(
				replyToMessage.channelId,
				replyToMessage.createdAt,
				TAKE_MESSAGES_DEFAULT
			);

			inputMessages = [
				...inputMessages,
				...provider.prepareChatMessages(historyMessages),
			];

			const llmMessage = await provider.completeMessage(
				model.model,
				inputMessages,
				params
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

	wrapSocketErrorHandler(
		socket,
		AgentEvent.START_PREVIEW_STREAM,
		async (payload: AgentPreviewPayload) => {
			const userId = socket.data.session.id as string;
			const { referToId, request, provider, model, agentId } = payload;

			const llmProvider: LlmProvider = await getProvider(
				socket,
				userId,
				provider
			);

			const messages: LlmMessageZType[] = [];
			let params: ModelParamsZType | undefined = undefined;
			if (agentId) {
				const agent = await agentService.getWithPromptsById(agentId);
				if (!agent) {
					throw new BadRequestError('Agent not found');
				}

				messages.push(
					...(agent.prompts?.map(
						(prompt) =>
							({
								role: 'system',
								content: prompt.content,
							} as LlmMessageZType)
					) || [])
				);

				params = agent.config?.modelParams;
			}

			messages.push({
				role: 'user',
				content: request,
			} as LlmMessageZType);

			await llmProvider.streamMessage(
				model,
				messages,
				(chunk) => {
					socket.emit(AgentEvent.PREVIEW_STREAM_CHUNK, {
						referToId,
						finished: false,
						chunk,
					} as StreamMessagePayload);
				},
				params
			);

			socket.emit(AgentEvent.PREVIEW_STREAM_CHUNK, {
				referToId,
				finished: true,
			} as StreamMessagePayload);
		}
	);
};

export default agentHandler;

async function getProvider(socket: Socket, userId: string, provider: string) {
	if (!socket.data.providerMap) {
		socket.data.providerMap = await userService.initProviders(userId);
	}

	const llmProvider: LlmProvider = socket.data.providerMap.get(provider);

	if (!llmProvider) {
		throw new ForbiddenError('Please provide a valid api key to continue.');
	}

	return llmProvider;
}

async function initLlmInput(
	userId: string,
	payload: AgentReplyPayload
): Promise<[LlmModelZType, ModelParamsZType | undefined, LlmMessageZType[]]> {
	const config = await userService.getConfigById(userId);
	let model = {
		provider: payload.provider,
		model: payload.model,
	} as LlmModelZType;
	let params = config.modelConfig?.modelParams;

	let inputMessages = [] as LlmMessageZType[];
	if (payload.agentId) {
		const agent = await agentService.getWithPromptsById(payload.agentId);

		if (!agent || agent.userId !== userId) {
			throw new BadRequestError();
		}

		if (agent.config?.defaultModel) {
			model = agent.config.defaultModel;
		}

		if (agent.config?.modelParams) {
			params = agent.config.modelParams;
		}

		if (agent.prompts) {
			inputMessages = agent.prompts?.map((item) =>
				convertPrompt2LlmMessage(item)
			);
		}
	}
	return [model, params, inputMessages];
}
