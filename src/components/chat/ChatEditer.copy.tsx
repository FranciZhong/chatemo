import { BasicMessageZType, MessagePayload } from '@/types/chat';
import {
	Cross2Icon,
	CubeIcon,
	ImageIcon,
	PaperPlaneIcon,
	RocketIcon,
} from '@radix-ui/react-icons';
import { EmojiClickData } from 'emoji-picker-react';
import { useState } from 'react';
import EmojiPickerButton from '../EmojiPickerButton';
import IconButton from '../IconButton';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Textarea } from '../ui/textarea';
import AgentPreview from './AgentPreview';
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

	const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setMessageContent(e.target.value);
	};

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
		setMessageContent('');
	};

	const handlePressEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSubmit();
		}
	};

	const handleClickEmoji = (emojiData: EmojiClickData) => {
		const emoji = emojiData.emoji;
		setMessageContent(messageContent + emoji);
	};

	return (
		<div className="w-full max-h-[60%] p-1 flex flex-col gap-1">
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

			<div className="flex items-center gap-2">
				<EmojiPickerButton onEmojiClick={handleClickEmoji} />
				<IconButton>
					<ImageIcon className="icon-size" />
				</IconButton>
				<IconButton onClick={() => setOpenPreview((value) => !value)}>
					<RocketIcon className="icon-size" />
				</IconButton>
				<IconButton>
					<CubeIcon className="icon-size" />
				</IconButton>
			</div>
			<div className="w-full relative px-2">
				<Textarea
					className="pr-16 focus-visible:ring-1 text-lg"
					placeholder="Write something ... Press Enter to send"
					value={messageContent}
					onChange={handleMessageChange}
					onKeyDown={handlePressEnter}
				/>
				<div className="absolute right-2 bottom-0">
					<Button className="shadow-md" onClick={handleSubmit}>
						<PaperPlaneIcon className="icon-size" />
					</Button>
				</div>
			</div>
		</div>
	);
};

export default ChatEditer;
