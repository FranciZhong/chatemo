import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
	region: process.env.AWS_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
	},
});

const signUrl = async (fileName: string, fileType: string) => {
	const uploadParams = {
		Bucket: process.env.AWS_S3_BUCKET_NAME!,
		Key: fileName,
		ContentType: fileType,
	};

	const command = new PutObjectCommand(uploadParams);
	const url = await getSignedUrl(s3Client, command, { expiresIn: 60 });

	return url;
};

const s3Gateway = {
	signUrl,
};

export default s3Gateway;
