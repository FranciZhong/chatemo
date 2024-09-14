import axiosInstance from '@/lib/axios';
import { ApiUrl } from '@/lib/constants';
import {
	FilePresignPayload,
	FilePresignResponse,
	FormatResponse,
} from '@/types/common';
import { useRef } from 'react';
import { toast } from './ui/use-toast';

interface Props {
	onChange: (url: string) => void;
	allowedFileTypes: string[];
	allowedFileSize: number;
	children: React.ReactNode;
}

const FileUploader: React.FC<Props> = ({
	onChange,
	allowedFileTypes,
	allowedFileSize,
	children,
}) => {
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const handleFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const selectedFile = event.target.files?.[0] || null;

		if (!selectedFile) {
			return;
		}

		if (!allowedFileTypes.includes(selectedFile.type)) {
			toast({
				title: 'Unacceptable file type',
				description: `The file to be uploaded should be in ${allowedFileTypes.join(
					', '
				)}`,
			});
			return;
		}

		if (selectedFile.size > allowedFileSize) {
			toast({
				title: 'File size is too large',
			});
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
					description: 'Fail to sign file url.',
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
				toast({
					title: 'Fail to upload image.',
				});
				return;
			}

			onChange(fileUrl);
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Something went wrong.',
			});
		}
	};

	return (
		<div onClick={() => fileInputRef.current?.click()}>
			<input
				ref={fileInputRef}
				type="file"
				className="hidden"
				onChange={handleFileChange}
			/>
			{children}
		</div>
	);
};

export default FileUploader;
