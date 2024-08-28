import { HttpStatusCode } from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import { ApiError } from './error';

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
