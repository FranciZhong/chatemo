import { ApiUrl } from '@/lib/constants';
import socketHandler from '@/server/events';
import { NextApiResponseServerIO } from '@/types/socket';
import { Server as HttpServer } from 'http';
import { NextApiRequest } from 'next';
import { Server as SocketServer } from 'socket.io';

const handler = async (req: NextApiRequest, res: NextApiResponseServerIO) => {
	if (!res.socket.server.io) {
		console.log('Start initializeing Socket.io server.');

		const httpServer: HttpServer = res.socket.server;
		const io = new SocketServer(httpServer, {
			path: ApiUrl.SOCKET,
		});
		res.socket.server.io = io;

		socketHandler(io);

		console.log('Socket.io server is initialized.');
	}

	res.end();
};

export default handler;
