import {
	FaceIcon,
	ImageIcon,
	PaperPlaneIcon,
	RocketIcon,
} from '@radix-ui/react-icons';
import { useState } from 'react';
import IconButton from '../IconButton';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';

interface Props {
	onSubmit: () => void;
}

const ChatEditer: React.FC<Props> = ({ onSubmit }) => {
	const [message, setMessage] = useState('');

	const handleMessageChange = (v: string) => {
		setMessage(message);
	};

	const handleSubmit = () => {
		if (!message.length) {
			return;
		}

		handleMessageChange(message);
		setMessage('');
	};

	return (
		<div className="w-full p-1 flex flex-col gap-1">
			<div className="flex items-center gap-2">
				<IconButton>
					<FaceIcon className="icon-size" />
				</IconButton>
				<IconButton onClick={() => {}}>
					<ImageIcon className="icon-size" />
				</IconButton>
				<IconButton onClick={() => {}}>
					<RocketIcon className="icon-size" />
				</IconButton>
			</div>
			<div className="w-full relative px-2">
				<Textarea
					className="pr-16 focus-visible:ring-1"
					placeholder="Write something ... Press Enter to send"
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
