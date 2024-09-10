import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { TrashIcon } from '@radix-ui/react-icons';

interface Props {
	title?: string;
	description?: string;
	onDelete: () => void;
}

const DeleteButton: React.FC<Props> = ({
	title = 'Are you sure?',
	description = 'This action might not be able to rallback.',
	onDelete,
}) => {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button size="xs" variant="outline" className="hover:bg-accent">
					<TrashIcon className="icon-size" />
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>{description}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction className="bg-accent" onClick={onDelete}>
						Continue
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default DeleteButton;
