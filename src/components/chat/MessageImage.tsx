import Image from 'next/image';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';

interface Props {
	src: string;
}

const MessageImage: React.FC<Props> = ({ src }) => {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<div className="message-container">
					<Image
						src={src}
						alt="Image"
						width={500}
						height={500}
						style={{ width: 'auto', height: 'auto' }}
					/>
				</div>
			</DialogTrigger>
			<DialogContent className="max-w-screen-lg max-h-screen-lg">
				<div className="pt-6">
					<Image
						src={src}
						alt="Image"
						width={2000}
						height={2000}
						style={{ width: '100%', height: 'auto' }}
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default MessageImage;
