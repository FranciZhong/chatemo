import { PaperPlaneIcon } from '@radix-ui/react-icons';
import { EmojiClickData } from 'emoji-picker-react';
import EmojiPickerButton from '../EmojiPickerButton';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';

interface Props {
	messageContent: string;
	setMessageContent: (value: string) => void;
	onSubmit: () => void;
	actions?: React.ReactNode[];
	children?: React.ReactNode;
}

const Editer: React.FC<Props> = ({
	messageContent,
	setMessageContent,
	onSubmit,
	actions,
	children,
}) => {
	const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setMessageContent(e.target.value);
	};

	const handleSubmit = () => {
		onSubmit();
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
		<div className="w-full p-1 flex flex-col gap-1">
			{children}
			<div className="flex items-center gap-2">
				<EmojiPickerButton onEmojiClick={handleClickEmoji} />
				{actions}
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

export default Editer;
