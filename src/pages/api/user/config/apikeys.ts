import {
	BadRequestError,
	MethodNotAllowedError,
	UnauthorizedError,
} from '@/server/error';
import { wrapErrorHandler } from '@/server/middleware';
import userService from '@/server/services/userService';
import { FormatResponse } from '@/types/common';
import { ApiConfigSchema, UserProfileZType } from '@/types/user';
import { HttpStatusCode } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'POST') {
		throw new MethodNotAllowedError();
	}

	const apiConfig = ApiConfigSchema.parse(req.body);
	if (!apiConfig) {
		throw new BadRequestError();
	}

	const token = await getToken({ req });
	if (!token || !token.sub) {
		throw new UnauthorizedError();
	}

	const userId = token.sub;
	const userProfile = await userService.getProfileById(userId);

	let config = {
		...userProfile.config,
		apiConfig,
	};

	const user = await userService.updateConfig(userId, config);

	res.status(HttpStatusCode.Ok).json({
		data: user,
		message: 'API keys successfully updated.',
	} as FormatResponse<UserProfileZType>);
};

export default wrapErrorHandler(handler);
