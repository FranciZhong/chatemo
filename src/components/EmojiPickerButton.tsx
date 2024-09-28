import { FaceIcon } from '@radix-ui/react-icons';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { MouseDownEvent } from 'emoji-picker-react/dist/config/config';
import { useEffect, useState } from 'react';
import IconButton from './IconButton';

interface Props {
	onEmojiClick: MouseDownEvent;
}

const EmojiPickerButton = ({ onEmojiClick }: Props) => {
	const [openPicker, setOpenPicker] = useState(false);

	useEffect(() => {
		if (!openPicker) {
			return;
		}

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				setOpenPicker(false);
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [openPicker]);

	const handleClick = () => setOpenPicker(!openPicker);

	const handlePick = (emojiData: EmojiClickData, event: MouseEvent) => {
		onEmojiClick(emojiData, event);
		setOpenPicker(false);
	};

	return (
		<div className="relative">
			{openPicker && (
				<div className="absolute left-0 bottom-10 z-50">
					<EmojiPicker onEmojiClick={handlePick} />
				</div>
			)}

			<IconButton onClick={handleClick}>
				<FaceIcon className="icon-size" />
			</IconButton>
		</div>
	);
};

export default EmojiPickerButton;
