import { BasicMessageZType } from '@/types/chat';
import { ArrowTopRightIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import rehypePrism from 'rehype-prism';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

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
			className="message-width px-1 rounded-md bg-hover text-sm text-foreground/60 hover:cursor-pointer"
		>
			{isOpen ? (
				<div className="flex flex-col gap-1">
					<div className="flex gap-1 items-center">
						<ArrowTopRightIcon className="h-3 w-3" />
						<span>to:</span>
					</div>
					<ReactMarkdown
						remarkPlugins={[remarkGfm, remarkBreaks, remarkMath]}
						rehypePlugins={[rehypePrism, rehypeKatex]}
					>
						{replyTo.content}
					</ReactMarkdown>
				</div>
			) : (
				<div className="flex gap-1 items-center">
					<ArrowTopRightIcon className="h-3 w-3" />
					<span>to:</span>
					<p className="flex-1 text-single-line">{replyTo.content}</p>
				</div>
			)}
		</div>
	);
};

export default RepliedMessage;
