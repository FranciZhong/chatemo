import axiosInstance from '@/lib/axios';
import {
	ApiUrl,
	AvatarSize,
	ImgUrl,
	MAX_IMAGE_FILE_SIZE,
} from '@/lib/constants';
import { cn, getAvatarSizeStyle } from '@/lib/utils';
import {
	FilePresignPayload,
	FilePresignResponse,
	FormatResponse,
} from '@/types/common';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Avatar, AvatarImage } from './ui/avatar';
import { toast } from './ui/use-toast';

interface Props {
	image?: string;
	onChange: (url: string) => void;
}

export const allowedImageTypes = [
	'image/jpeg',
	'image/png',
	'image/gif',
	'image/webp',
	'image/svg+xml',
];

const AvatarUploader: React.FC<Props> = ({ image, onChange }) => {
	const [uploadError, setUploadError] = useState<string | null>(null);
	const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

	const onDrop = async (acceptedFiles: File[]) => {
		const selectedFile = acceptedFiles[0];

		if (selectedFile) {
			setUploadError(null);
			setUploadSuccess(null);

			if (!allowedImageTypes.includes(selectedFile.type)) {
				setUploadError('Unacceptable file type.');
				return;
			}

			if (selectedFile.size > MAX_IMAGE_FILE_SIZE) {
				setUploadError('Image file cannot be larger than 5MB.');
				return;
			}

			try {
				const response = await axiosInstance.post<
					FormatResponse<FilePresignResponse>
				>(ApiUrl.FILE_PRESIGN, {
					fileName: selectedFile.name,
					fileType: selectedFile.type,
				} as FilePresignPayload);

				if (!response.data.data) {
					toast({
						title: 'Error',
						description: 'Fail to sign image url.',
					});
					return;
				}

				const { uploadUrl, fileUrl } = response.data.data;

				// upload directly to aws s3
				const uploadResponse = await fetch(uploadUrl, {
					method: 'PUT',
					body: selectedFile,
					headers: {
						'Content-Type': selectedFile.type,
					},
				});

				if (!uploadResponse.ok) {
					setUploadError('Fail to upload image.');
					return;
				}

				setUploadSuccess(`${selectedFile.name} is successfully uploaded.`);
				onChange(fileUrl);
			} catch (error) {
				setUploadError('Something went wrong.');
				toast({
					title: 'Error',
					description: 'Something went wrong.',
				});
			}
		}
	};

	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

	return (
		<div className="flex px-4 gap-8 justify-between items-center">
			<Avatar className={getAvatarSizeStyle(AvatarSize.XL)}>
				<AvatarImage src={image || ImgUrl.USER_AVATAR_ALT} />
			</Avatar>
			<div className="flex-1 flex flex-col gap-4 justify-between">
				<div
					{...getRootProps()}
					className={cn(
						'flex-1 border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200',
						isDragActive && 'border-secondary bg-hover'
					)}
				>
					<input {...getInputProps()} />
					<p className="text-foreground">Upload image here!</p>
				</div>
				{uploadError && (
					<p className="text-accent text-single-line">{uploadError}</p>
				)}
				{uploadSuccess && (
					<p className="text-secondary text-single-line">{uploadSuccess}</p>
				)}
			</div>
		</div>
	);
};

export default AvatarUploader;
