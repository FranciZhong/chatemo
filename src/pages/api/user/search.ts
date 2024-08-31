import { MethodNotAllowedError } from '@/server/error';
import { wrapErrorHandler } from '@/server/middleware';
import userService from '@/server/services/userService';
import { FormatResponse } from '@/types/common';
import { UserZType } from '@/types/user';
import { HttpStatusCode } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'GET') {
		throw new MethodNotAllowedError();
	}

	const name = req.query.name as string;
	if (!name) {
		res.status(HttpStatusCode.BadRequest).json({ error: 'No name in query.' });
	}

	const matchedUsers = await userService.searchByName(name);

	res.status(HttpStatusCode.Ok).json({
		data: matchedUsers,
	} as FormatResponse<UserZType[]>);
};

export default wrapErrorHandler(handler);
