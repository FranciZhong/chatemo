import { BasicMessageZType } from '@/types/chat';
import { ArrowTopRightIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import { useState } from 'react';
import MarkdownContent from '../MarkdownContent';

interface Props {
	replyTo: BasicMessageZType;
}

const RepliedMessage: React.FC<Props> = ({ replyTo }) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div
			onClick={() => {
				setIsOpen((value) => !value);
			}}
			className="message-container message-width p-1 bg-hover text-sm text-foreground/60 hover:cursor-pointer"
		>
			{isOpen ? (
				<div className="flex flex-col gap-1">
					<div className="flex gap-1 items-center">
						<ArrowTopRightIcon className="h-3 w-3" />
						<span>to:</span>
					</div>
					<MarkdownContent className="text-sm text-foreground/60">
						{replyTo.content}
					</MarkdownContent>
					{!replyTo.content && replyTo.image && (
						<Image src={replyTo.image} alt="image" width={280} height={210} />
					)}
				</div>
			) : (
				<div className="flex gap-1 items-center">
					<ArrowTopRightIcon className="h-3 w-3" />
					<span>to:</span>
					{replyTo.content ? (
						<p className="flex-1 text-single-line">{replyTo.content}</p>
					) : (
						replyTo.image && (
							<Image src={replyTo.image} alt="image" width={32} height={24} />
						)
					)}
				</div>
			)}
		</div>
	);
};

export default RepliedMessage;
