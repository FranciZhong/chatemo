import { Button } from '@/components/ui/button';
import { TrashIcon } from '@radix-ui/react-icons';
import WarningTrigger from './WarningTrigger';

interface Props {
	title?: string;
	description?: string;
	onDelete: () => void;
}

const DeleteButton: React.FC<Props> = ({ title, description, onDelete }) => {
	return (
		<WarningTrigger
			title={title}
			description={description}
			onContinue={onDelete}
		>
			<Button size="xs" variant="outline" className="hover:bg-accent">
				<TrashIcon className="icon-size" />
			</Button>
		</WarningTrigger>
	);
};

export default DeleteButton;
