import { BasicMessageZType, MessagePayload } from '@/types/chat';
import {
	Cross2Icon,
	CubeIcon,
	ImageIcon,
	RocketIcon,
} from '@radix-ui/react-icons';
import { useState } from 'react';
import IconButton from '../IconButton';
import { ScrollArea } from '../ui/scroll-area';
import AgentPreview from './AgentPreview';
import Editer from './Editer';
import RepliedMessage from './RepliedMessage';

interface Props {
	replyTo?: BasicMessageZType | null;
	onDeleteReplyTo: () => void;
	onSubmit: (payload: MessagePayload) => void;
}

const ChatEditer: React.FC<Props> = ({
	replyTo,
	onDeleteReplyTo,
	onSubmit,
}) => {
	const [messageContent, setMessageContent] = useState('');
	const [openPreview, setOpenPreview] = useState(false);

	const handleSubmit = () => {
		if (!messageContent.length) {
			return;
		}

		const payload: MessagePayload = {
			content: messageContent,
			replyTo: replyTo?.id,
		};

		onSubmit(payload);
		onDeleteReplyTo();
	};

	const actions = [
		<IconButton key="image-button">
			<ImageIcon className="icon-size" />
		</IconButton>,
		<IconButton key="model-button">
			<CubeIcon className="icon-size" />
		</IconButton>,
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
				<div className="flex items-center gap-2 justify-start">
					<RepliedMessage replyTo={replyTo} />
					<IconButton onClick={onDeleteReplyTo} className="hover:bg-accent">
						<Cross2Icon />
					</IconButton>
				</div>
			)}
		</Editer>
	);
};

export default ChatEditer;
