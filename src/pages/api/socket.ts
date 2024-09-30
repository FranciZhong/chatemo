import { ApiUrl } from '@/lib/constants';
import socketHandler from '@/server/events';
import { initClient } from '@/server/redis';
import { NextApiResponseServerIO } from '@/types/socket';
import { Server as HttpServer } from 'http';
import { NextApiRequest } from 'next';
import { Server as SocketServer } from 'socket.io';
import { createAdapter } from 'socket.io-redis';

const handler = async (req: NextApiRequest, res: NextApiResponseServerIO) => {
	if (!res.socket.server.io) {
		console.log('Start initializeing Socket.io server.');

		const httpServer: HttpServer = res.socket.server;
		const io = new SocketServer(httpServer, {
			path: ApiUrl.SOCKET,
		});
		res.socket.server.io = io;
		if (process.env.REDIS_HOST) {
			const pubClient = initClient();
			const subClient = initClient();
			io.adapter(createAdapter({ pubClient, subClient }));
		}

		socketHandler(io);

		console.log('Socket.io server is initialized.');
	}

	res.end();
};

export default handler;
