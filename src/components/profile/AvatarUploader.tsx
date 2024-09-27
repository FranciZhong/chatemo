import axiosInstance from '@/lib/axios';
import {
	allowedImageTypes,
	ApiUrl,
	AvatarSize,
	MAX_IMAGE_FILE_SIZE,
	TOAST_ERROR_DEFAULT,
} from '@/lib/constants';
import { cn, getAvatarSizeStyle } from '@/lib/utils';
import {
	FilePresignPayload,
	FilePresignResponse,
	FormatResponse,
} from '@/types/common';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Avatar, AvatarImage } from '../ui/avatar';
import { toast } from '../ui/use-toast';

interface Props {
	image: string;
	onChange: (url: string) => void;
}

const AvatarUploader: React.FC<Props> = ({ image, onChange }) => {
	const [isUploading, setIsUploading] = useState<boolean>(false);
	const [isError, setIsError] = useState<boolean>(false);
	const [uploadMessage, setUploadMessage] = useState<string>(' ');

	const onDrop = async (acceptedFiles: File[]) => {
		const selectedFile = acceptedFiles[0];

		if (!selectedFile) {
			return;
		}

		setIsUploading(true);
		setIsError(false);
		setUploadMessage(' ');

		if (!allowedImageTypes.includes(selectedFile.type)) {
			setIsUploading(false);
			setIsError(true);
			setUploadMessage('Unacceptable file type.');
			return;
		}

		if (selectedFile.size > MAX_IMAGE_FILE_SIZE) {
			setIsUploading(false);
			setIsError(true);
			setUploadMessage('Image file cannot be larger than 5MB.');
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
				setIsError(true);
				setUploadMessage('Fail to upload image.');
				return;
			}

			setIsUploading(false);
			setUploadMessage(`${selectedFile.name} is successfully uploaded.`);
			onChange(fileUrl);
		} catch (error) {
			setIsUploading(false);
			setIsError(true);
			setUploadMessage('Something went wrong.');
			toast(TOAST_ERROR_DEFAULT);
		}
	};

	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

	return (
		<div className="flex px-4 gap-8 justify-between items-center">
			<Avatar className={cn(getAvatarSizeStyle(AvatarSize.XL), 'bg-secondary')}>
				<AvatarImage src={image} />
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
					{isUploading ? (
						<p className="text-secondary">Uploading ...</p>
					) : (
						<p className="text-foreground">Upload image here!</p>
					)}
				</div>
				<p
					className={cn(
						'text-single-line h-4',
						isError ? 'text-accent' : 'text-secondary'
					)}
				>
					{uploadMessage}
				</p>
			</div>
		</div>
	);
};

export default AvatarUploader;
