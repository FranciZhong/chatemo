import { allowedImageTypes, MAX_IMAGE_FILE_SIZE } from '@/lib/constants';
import { BasicMessageZType, MessagePayload } from '@/types/chat';
import { LlmModelZType } from '@/types/llm';
import { Cross2Icon, ImageIcon, RocketIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import { useState } from 'react';
import FileUploader from '../FileUploader';
import IconButton from '../IconButton';
import SelectModelButton from '../SelectModelButton';
import { ScrollArea } from '../ui/scroll-area';
import AgentPreview from './AgentPreview';
import Editer from './Editer';
import RepliedMessage from './RepliedMessage';

interface Props {
	replyTo?: BasicMessageZType | null;
	onDeleteReplyTo: () => void;
	onSubmit: (payload: MessagePayload) => void;
	selectedModel: LlmModelZType;
	onSelectedModelChange: (model: LlmModelZType) => void;
}

const ChatEditer: React.FC<Props> = ({
	replyTo,
	onDeleteReplyTo,
	onSubmit,
	selectedModel,
	onSelectedModelChange,
}) => {
	const [messageContent, setMessageContent] = useState<string>('');
	const [openPreview, setOpenPreview] = useState<boolean>(false);
	const [uploadedImage, setUploadedImage] = useState<string | undefined>(
		undefined
	);

	const handleDeleteImage = async () => {
		setUploadedImage(undefined);
	};

	const handleSubmit = () => {
		if (!messageContent.length && !uploadedImage) {
			return;
		}

		const payload: MessagePayload = {
			content: messageContent,
			image: uploadedImage,
			replyTo: replyTo?.id,
		};

		onSubmit(payload);
		onDeleteReplyTo();
		setUploadedImage(undefined);
	};

	const actions = [
		<FileUploader
			key="image-button"
			onChange={setUploadedImage}
			allowedFileTypes={allowedImageTypes}
			allowedFileSize={MAX_IMAGE_FILE_SIZE}
		>
			<IconButton>
				<ImageIcon className="icon-size" />
			</IconButton>
		</FileUploader>,
		<SelectModelButton
			key="model-button"
			selectedModel={selectedModel}
			onSelectedModelChange={onSelectedModelChange}
		/>,
		<IconButton
			key="agent-button"
			onClick={() => setOpenPreview((value) => !value)}
		>
			<RocketIcon className="icon-size" />
		</IconButton>,
	];

	return (
		<Editer
			messageContent={messageContent}
			setMessageContent={setMessageContent}
			onSubmit={handleSubmit}
			actions={actions}
		>
			{openPreview && (
				<ScrollArea className="w-full">
					<AgentPreview request={messageContent} />
				</ScrollArea>
			)}

			{replyTo && (
				<div className="flex items-center gap-1 justify-start">
					<RepliedMessage replyTo={replyTo} />
					<IconButton
						onClick={onDeleteReplyTo}
						className="icon-sm-button hover:bg-accent"
					>
						<Cross2Icon />
					</IconButton>
				</div>
			)}
			{uploadedImage && (
				<div className="flex items-center gap-1 justify-start">
					<div className="message-container">
						<Image src={uploadedImage} alt="image" width={64} height={48} />
					</div>
					<IconButton
						onClick={handleDeleteImage}
						className="icon-sm-button hover:bg-accent"
					>
						<Cross2Icon />
					</IconButton>
				</div>
			)}
		</Editer>
	);
};

export default ChatEditer;
