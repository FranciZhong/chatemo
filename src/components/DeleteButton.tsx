import { Button } from '@/components/ui/button';
import { Trash2Icon } from 'lucide-react';
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
				<Trash2Icon className="icon-size" />
			</Button>
		</WarningTrigger>
	);
};

export default DeleteButton;
