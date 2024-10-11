import { allowedImageTypes, MAX_IMAGE_FILE_SIZE } from '@/lib/constants';
import { BasicMessageZType, MessagePayload } from '@/types/chat';
import { AgentZType, LlmModelZType } from '@/types/llm';
import { Cross2Icon, ImageIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import { useState } from 'react';
import FileUploader from '../FileUploader';
import HoverTooltip from '../HoverTooltip';
import IconButton from '../IconButton';
import SelectAgentButton from '../SelectAgentButton';
import SelectModelButton from '../SelectModelButton';
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
	const [previewRequest, setPreviewRequest] = useState<string>('');
	const [previewAgent, setPreviewAgent] = useState<AgentZType | null>(null);
	const [uploadedImage, setUploadedImage] = useState<string | undefined>(
		undefined
	);

	const handleSelectedAgentChange = (agent: AgentZType | null) => {
		setPreviewAgent(agent);
		setOpenPreview(true);
	};

	const handleClosePreview = () => {
		setOpenPreview(false);
		setPreviewRequest('');
	};

	const handleDeleteImage = async () => {
		setUploadedImage(undefined);
	};

	const handleSubmit = () => {
		if (openPreview) {
			if (!messageContent.length) {
				return;
			}

			setPreviewRequest(messageContent);
		} else {
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
		}
	};

	const actions = [
		<HoverTooltip key="image-button" content="Upload Image">
			<FileUploader
				onChange={setUploadedImage}
				allowedFileTypes={allowedImageTypes}
				allowedFileSize={MAX_IMAGE_FILE_SIZE}
			>
				<IconButton>
					<ImageIcon className="icon-size" />
				</IconButton>
			</FileUploader>
		</HoverTooltip>,
		<HoverTooltip key="model-button" content="Switch Model">
			<SelectModelButton
				selectedModel={selectedModel}
				onSelectedModelChange={onSelectedModelChange}
			/>
		</HoverTooltip>,
		<HoverTooltip key="preview-button" content="Agent Preview">
			<SelectAgentButton onSelectedAgentChange={handleSelectedAgentChange} />
		</HoverTooltip>,
	];

	return (
		<Editer
			messageContent={messageContent}
			setMessageContent={setMessageContent}
			onSubmit={handleSubmit}
			actions={actions}
		>
			{openPreview && (
				<AgentPreview
					request={previewRequest}
					model={selectedModel}
					agent={previewAgent}
					onClose={handleClosePreview}
					className="h-96 md:h-[480px]"
				/>
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
