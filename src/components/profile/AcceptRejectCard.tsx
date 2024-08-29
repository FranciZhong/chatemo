import { Card } from '@/components/ui/card';
import { CheckIcon, Cross2Icon } from '@radix-ui/react-icons';
import IconButton from '../IconButton';

interface Props {
	children: React.ReactNode;
	onAccept: () => void;
	onReject: () => void;
}

const AcceptRejectCard = ({ children, onAccept, onReject }: Props) => {
	const cardAction = () => {};

	return (
		<Card className="w-full min-h-24 px-4 py-2 flex gap-2 items-center justify-end">
			<div className="flex-1">{children}</div>
			<div className="flex items-center gap-2 justify-between">
				<IconButton onClick={onAccept} className="hover:bg-secondary">
					<CheckIcon className="icon-size" />
				</IconButton>
				<IconButton onClick={onReject} className="hover:bg-accent">
					<Cross2Icon className="icon-size" />
				</IconButton>
			</div>
		</Card>
	);
};

export default AcceptRejectCard;
