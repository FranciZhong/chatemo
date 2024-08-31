import { Server } from 'socket.io';
import { authSocketMiddleware } from '../middleware';
import chatHandler from './chatHandler';
import userHandler from './userHandler';

export const USER_PREFFIX = 'user:';
export const CHANNEL_PREFIX = 'channel:';

const socketHandler = (io: Server) => {
	io.use(authSocketMiddleware);

	io.on('connection', (socket) => {
		// join room user:[id]
		const userRoom = USER_PREFFIX + socket.data.session.id;
		socket.join(userRoom);
		console.log(` Socket [${socket.id}] ${userRoom} connected`);

		socket.on('disconnect', () => {
			socket.leave(userRoom);
			console.log(` Socket [${socket.id}] ${userRoom} disconnected`);
		});

		// bind event handlers
		userHandler(io, socket);
		chatHandler(io, socket);
	});
};

export default socketHandler;
