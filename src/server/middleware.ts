import { verifyToken } from '@/lib/auth';
import { UserEvent } from '@/lib/events';
import { HttpStatusCode } from 'axios';
import { parse } from 'cookie';
import { NextRequest, NextResponse } from 'next/server';
import { Server, Socket } from 'socket.io';
import { ApiError, UnauthorizedError } from './error';
import { USER_PREFFIX } from './events';

export const wrapErrorHandler = (
	handler: (req: NextRequest) => Promise<NextResponse>
) => {
	return async (req: NextRequest) => {
		try {
			return await handler(req);
		} catch (error) {
			if (error instanceof ApiError) {
				return NextResponse.json(
					{ error: error.message },
					{ status: error.statusCode }
				);
			} else {
				return NextResponse.json(
					{ error: 'Something went wrong.' },
					{ status: HttpStatusCode.InternalServerError }
				);
			}
		}
	};
};

export const wrapSocketErrorHandler = (
	io: Server,
	socket: Socket,
	event: string,
	action: (payload: any) => void | Promise<void>
) => {
	return socket.on(event, async (payload: any) => {
		const userRoom = USER_PREFFIX + socket.data.session.id;

		try {
			console.log(` Event [${event}] from ${userRoom}`, payload);
			await action(payload);
		} catch (error) {
			console.error(
				` Error on event[${event}] from ${userRoom}`,
				payload,
				error
			);
			if (error instanceof ApiError) {
				socket.emit(UserEvent.ERROR_ACCTION, error.message);
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
