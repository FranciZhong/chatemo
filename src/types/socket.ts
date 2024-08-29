import { Server as HttpServer } from 'http';
import { Socket } from 'net';
import { NextApiResponse } from 'next';
import { Server as SocketServer } from 'socket.io';

export type NextApiResponseServerIO = NextApiResponse & {
	socket: Socket & {
		server: HttpServer & {
			io: SocketServer;
		};
	};
};
