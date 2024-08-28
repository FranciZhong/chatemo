import { wrapErrorHandler } from '@/server/middleware';
import userService from '@/server/services/userService';
import { HttpStatusCode } from 'axios';
import { NextRequest, NextResponse } from 'next/server';

const getHandler = async (req: NextRequest) => {
	const name = req.nextUrl.searchParams.get('name');
	if (!name) {
		return NextResponse.json(
			{ message: 'Bad request' },
			{ status: HttpStatusCode.BadRequest }
		);
	}

	const matchedUsers = await userService.searchByName(name);
	return NextResponse.json(
		{
			data: matchedUsers,
		},
		{ status: HttpStatusCode.Ok }
	);
};

export const GET = wrapErrorHandler(getHandler);
