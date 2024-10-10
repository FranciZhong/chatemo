import { cn } from '@/lib/utils';
import { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import rehypePrism from 'rehype-prism';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

interface Props {
	children?: string;
	className?: string;
}

const MarkdownContent: React.FC<Props> = ({ children, className }) => {
	return (
		<div className={cn('prose break-words', className)}>
			<ReactMarkdown
				remarkPlugins={[remarkGfm, remarkBreaks, remarkMath]}
				rehypePlugins={[rehypePrism, rehypeKatex]}
			>
				{children}
			</ReactMarkdown>
		</div>
	);
};

export default memo(MarkdownContent);
