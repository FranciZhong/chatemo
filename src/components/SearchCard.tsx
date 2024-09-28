import { PlusIcon } from '@radix-ui/react-icons';
import IconButton from './IconButton';

interface Props {
	children: React.ReactNode;
	onClick: () => Promise<void> | void;
}

const SearchCard: React.FC<Props> = ({ children, onClick }) => {
	return (
		<div className="w-full p-4 rounded-lg border-[1px] border-border flex gap-2 items-center justify-end">
			<div className="flex-1">{children}</div>
			<IconButton onClick={onClick}>
				<PlusIcon className="icon-size" />
			</IconButton>
		</div>
	);
};

export default SearchCard;
