import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from './ui/tooltip';

interface Props {
	content: string;
	children: React.ReactNode;
}

const HoverTooltip: React.FC<Props> = ({ content, children }) => {
	const [isHover, setIsHover] = useState(false);
	const [debouncedIsHover] = useDebounce(isHover, 300);

	return (
		<TooltipProvider>
			<Tooltip open={debouncedIsHover}>
				<TooltipTrigger asChild>
					<div
						onMouseEnter={() => setIsHover(true)}
						onMouseLeave={() => setIsHover(false)}
						onClick={() => setIsHover(false)}
					>
						{children}
					</div>
				</TooltipTrigger>
				<TooltipContent>
					<p className="max-w-80 text-sm break-words">{content}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export default HoverTooltip;
