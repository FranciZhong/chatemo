import { AgentEvent } from '@/lib/events';
import { LlmModelZType } from '@/types/llm';
import { Server } from 'socket.io';
import { authSocketMiddleware } from '../middleware';
import channelService from '../services/channelService';
import userService from '../services/userService';
import agentHandler from './agentHandler';
import chatHandler from './chatHandler';
import userHandler from './userHandler';

export const USER_PREFFIX = 'user:';
export const CHANNEL_PREFIX = 'channel:';

const socketHandler = (io: Server) => {
	io.use(authSocketMiddleware);

	io.on('connection', async (socket) => {
		// join room user:[id]
		const userId = socket.data.session.id as string;
		const userRoom = USER_PREFFIX + userId;
		socket.join(userRoom);
		console.log(` Socket [${socket.id}] ${userRoom} connected`);

		// join channels
		const channels = await channelService.getChannelsByUserId(userId);
		channels.forEach((channel) => socket.join(CHANNEL_PREFIX + channel.id));

		// init llm providers
		try {
			const providerMap = await userService.initProviders(userId);
			socket.data.providerMap = providerMap;

			const availableModels = [] as LlmModelZType[];
			for (const provider of Array.from(providerMap.values())) {
				const models = await provider.getModels();
				availableModels.push(...models);
			}

			socket.emit(AgentEvent.AVAILABLE_MODELS, availableModels);
		} catch (error) {
			console.error(
				` Socket [${socket.id}] ${userRoom} fail to init providers`,
				error
			);
		}

		socket.on('disconnect', () => {
			console.log(` Socket [${socket.id}] ${userRoom} disconnected`);
		});

		// bind event handlers
		userHandler(io, socket);
		chatHandler(io, socket);
		agentHandler(io, socket);
	});
};

export default socketHandler;
