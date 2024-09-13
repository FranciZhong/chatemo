import {
	BadRequestError,
	MethodNotAllowedError,
	UnauthorizedError,
} from '@/server/error';
import { wrapErrorHandler } from '@/server/middleware';
import userService from '@/server/services/userService';
import { FormatResponse } from '@/types/common';
import { ProfilePayloadSchema, UserProfileZType } from '@/types/user';
import { HttpStatusCode } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'POST') {
		throw new MethodNotAllowedError();
	}

	const payload = ProfilePayloadSchema.parse(req.body);
	if (!payload) {
		throw new BadRequestError();
	}

	const token = await getToken({ req });
	if (!token) {
		throw new UnauthorizedError();
	}

	const userId = token.sub!;
	const user = await userService.updateProfile(userId, payload);

	res.status(HttpStatusCode.Ok).json({
		data: user,
		message: 'User profile successfully updated.',
	} as FormatResponse<UserProfileZType>);
};

export default wrapErrorHandler(handler);
