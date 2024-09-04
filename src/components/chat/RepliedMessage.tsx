import { BasicMessageZType } from '@/types/chat';
import { ArrowTopRightIcon } from '@radix-ui/react-icons';

interface Props {
	replyTo: BasicMessageZType;
}

const RepliedMessage: React.FC<Props> = ({ replyTo }) => {
	return (
		<div className="message-width px-1 flex gap-1 items-center rounded-md bg-hover text-sm text-foreground/60">
			<ArrowTopRightIcon />
			<span>to:</span>
			<p className="text-single-line">{replyTo.content}</p>
		</div>
	);
};

export default RepliedMessage;
