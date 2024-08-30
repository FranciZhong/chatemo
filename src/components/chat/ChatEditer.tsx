import { ImageIcon, PaperPlaneIcon, RocketIcon } from '@radix-ui/react-icons';
import { EmojiClickData } from 'emoji-picker-react';
import { useState } from 'react';
import EmojiPickerButton from '../EmojiPickerButton';
import IconButton from '../IconButton';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';

interface Props {
	onSubmit: (message: string) => void;
}

const ChatEditer: React.FC<Props> = ({ onSubmit }) => {
	const [message, setMessage] = useState('');

	const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setMessage(e.target.value);
	};

	const handleSubmit = () => {
		if (!message.length) {
			return;
		}

		onSubmit(message);
		setMessage('');
	};

	const handlePressEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSubmit();
		}
	};

	const handleClickEmoji = (emojiData: EmojiClickData) => {
		const emoji = emojiData.emoji;
		setMessage(message + emoji);
	};

	return (
		<div className="w-full p-1 flex flex-col gap-1">
			<div className="flex items-center gap-2">
				<EmojiPickerButton onEmojiClick={handleClickEmoji} />
				<IconButton onClick={() => {}}>
					<ImageIcon className="icon-size" />
				</IconButton>
				<IconButton onClick={() => {}}>
					<RocketIcon className="icon-size" />
				</IconButton>
			</div>
			<div className="w-full relative px-2">
				<Textarea
					className="pr-16 focus-visible:ring-1 text-lg"
					placeholder="Write something ... Press Enter to send"
					value={message}
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
