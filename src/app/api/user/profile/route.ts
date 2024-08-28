import { NotFoundError, UnauthorizedError } from '@/server/error';
import { wrapErrorHandler } from '@/server/middleware';
import userService from '@/server/services/userService';
import { HttpStatusCode } from 'axios';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';

const getHandler = async (req: NextRequest) => {
	// todo change to a search profile api

	const session = await getServerSession(authOptions);
	const userId = session?.user.id;
	if (!userId) {
		throw new UnauthorizedError();
	}

	try {
		const currentUser = userService.getById(userId);

		return NextResponse.json(
			{ data: currentUser },
			{ status: HttpStatusCode.Ok }
		);
	} catch (error) {
		if (error instanceof NotFoundError) {
			throw new UnauthorizedError();
		}
		throw error;
	}
};

export const GET = wrapErrorHandler(getHandler);
