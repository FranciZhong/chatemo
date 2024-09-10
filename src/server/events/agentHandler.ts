import { AgentEvent, ChatEvent } from '@/lib/events';
import { convertPrompt2LlmMessage } from '@/lib/utils';
import { AgentReplyPayload, LlmMessageZType, LlmProvider } from '@/types/llm';
import { Server, Socket } from 'socket.io';
import { USER_PREFFIX } from '.';
import { BadRequestError, ForbiddenError } from '../error';
import { wrapSocketErrorHandler } from '../middleware';
import agentService from '../services/agentService';
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

			if (!socket.data.providerMap) {
				socket.data.providerMap = await userService.initProviders(userId);
			}

			const provider: LlmProvider = socket.data.providerMap.get(
				payload.provider
			);
			if (!provider) {
				throw new ForbiddenError('Please provide a valid api key to continue.');
			}

			// emit pending message
			const newMessage = await conversationService.createMessage(
				userId,
				'MODEL',
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
				ChatEvent.NEW_CONVERSATION_MESSAGE,
				newMessage
			);

			// todo handle error and update message
			// get response from providers
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
				llmMessage.content
			);

			io.to(participantRooms).emit(
				ChatEvent.UPDATE_CONVERSATION_MESSAGE,
				updatedMessage
			);
		}
	);
};

export default agentHandler;
