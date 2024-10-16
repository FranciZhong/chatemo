import { verifyToken } from '@/lib/auth';
import { UserEvent } from '@/lib/events';
import { HttpStatusCode } from 'axios';
import { parse } from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';
import { Socket } from 'socket.io';
import { ApiError, LlmProviderError, UnauthorizedError } from './error';
import { USER_PREFFIX } from './events';

export const wrapErrorHandler = (
	handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) => {
	return async (req: NextApiRequest, res: NextApiResponse) => {
		try {
			return await handler(req, res);
		} catch (error) {
			// todo error req
			console.error(error);
			if (error instanceof ApiError) {
				res.status(error.statusCode).json({ error: error.message });
			} else {
				res
					.status(HttpStatusCode.InternalServerError)
					.json({ error: 'Something went wrong.' });
			}
		}
	};
};

export const wrapSocketErrorHandler = (
	socket: Socket,
	event: string,
	action: (payload: any) => void | Promise<void>
) => {
	return socket.on(event, async (payload: any) => {
		const userRoom = USER_PREFFIX + socket.data.session.id;
		console.log(` Event [${event}] from ${userRoom}`, payload);

		try {
			await action(payload);
		} catch (error) {
			console.error(
				` Error on event[${event}] from ${userRoom}`,
				payload,
				error
			);
			if (error instanceof ApiError) {
				socket.emit(UserEvent.ERROR_ACCTION, error.message);
			} else if (error instanceof LlmProviderError) {
				socket.emit(
					UserEvent.ERROR_ACCTION,
					`[${error.provider.toUpperCase()}]${error.message}`
				);
			} else {
				socket.emit(UserEvent.ERROR_ACCTION, 'Something went wrong.');
			}
		}
	});
};

export const authSocketMiddleware = async (
	socket: Socket,
	next: (err?: Error) => void
) => {
	const cookie = socket.handshake.headers.cookie;
	if (!cookie) {
		return next(new UnauthorizedError());
	}
	const token = parse(cookie)['next-auth.session-token'];
	if (!token) {
		return next(new UnauthorizedError());
	}

	const session = await verifyToken(token);
	if (session) {
		(socket as any).data.session = session;
		next();
	} else {
		next(new UnauthorizedError());
	}
};
