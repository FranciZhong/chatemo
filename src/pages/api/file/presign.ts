import { MethodNotAllowedError } from '@/server/error';
import s3Gateway from '@/server/gateways/s3Gateway';
import { wrapErrorHandler } from '@/server/middleware';
import {
	FilePresignPayloadSchema,
	FilePresignResponse,
	FormatResponse,
} from '@/types/common';
import { HttpStatusCode } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'POST') {
		throw new MethodNotAllowedError();
	}

	const { fileName, fileType } = FilePresignPayloadSchema.parse(req.body);

	const uniqueName = uuidv4() + '-' + fileName;
	const uploadUrl = await s3Gateway.signUrl(uniqueName, fileType);
	const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueName}`;

	res.status(HttpStatusCode.Ok).json({
		data: { uploadUrl, fileUrl },
	} as FormatResponse<FilePresignResponse>);
};

export default wrapErrorHandler(handler);
