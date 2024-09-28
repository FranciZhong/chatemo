import { AgentEvent, UserEvent } from '@/lib/events';
import { LlmModelZType } from '@/types/llm';
import { Server, Socket } from 'socket.io';
import { wrapSocketErrorHandler } from '../middleware';
import userService from '../services/userService';

const userHandler = (io: Server, socket: Socket) => {
	wrapSocketErrorHandler(socket, UserEvent.UPDATE_APIKEYS, async () => {
		const userId = socket.data.session.id as string;
		const providerMap = await userService.initProviders(userId);
		socket.data.providerMap = providerMap;

		const availableModels = [] as LlmModelZType[];
		for (const provider of Array.from(providerMap.values())) {
			const models = await provider.getModels();
			availableModels.push(...models);
		}
		socket.emit(AgentEvent.AVAILABLE_MODELS, availableModels);
	});
};

export default userHandler;
