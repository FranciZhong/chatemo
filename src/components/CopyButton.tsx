import { CopyIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { Button } from './ui/button';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from './ui/tooltip';

interface Props {
	content: string;
}

const CopyButton: React.FC<Props> = ({ content }) => {
	const [isCopied, setIsCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(content);
			setIsCopied(true);
			setTimeout(() => setIsCopied(false), 3000);
		} catch (error) {
			console.error('Fail to copy', error);
		}
	};

	return (
		<TooltipProvider>
			<Tooltip open={isCopied}>
				<TooltipTrigger asChild>
					<Button
						className="relative"
						size="xs"
						variant="outline"
						onClick={handleCopy}
					>
						<CopyIcon className="icon-size" />
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					<p>Copied</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export default CopyButton;
