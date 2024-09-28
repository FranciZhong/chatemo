import { LlmProviderName } from '@/lib/constants';
import { Server as HttpServer } from 'http';
import { Socket } from 'net';
import { NextApiResponse } from 'next';
import { Server as SocketServer } from 'socket.io';
import { LlmProvider } from './llm';

export type NextApiResponseServerIO = NextApiResponse & {
	socket: Socket & {
		server: HttpServer & {
			io: SocketServer;
		};
		providerMap?: Map<LlmProviderName, LlmProvider>;
	};
};
