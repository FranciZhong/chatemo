import { UnauthorizedError } from '@/server/error';
import { wrapErrorHandler } from '@/server/middleware';
import userService from '@/server/services/userService';
import { FriendRequestPayloadSchema } from '@/types/user';
import { HttpStatusCode } from 'axios';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';

const postHandler = async (req: NextRequest) => {
	const session = await getServerSession(authOptions);
	const senderId = session?.user.id;

	if (!senderId) {
		throw new UnauthorizedError();
	}

	const { receiverId } = FriendRequestPayloadSchema.parse(await req.json());
	await userService.sendFriendRequest(senderId, receiverId);

	return NextResponse.json(
		{ message: 'A friend request is sent.' },
		{ status: HttpStatusCode.Created }
	);
};

export const POST = wrapErrorHandler(postHandler);
