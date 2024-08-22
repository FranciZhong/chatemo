import {
	DragHandleHorizontalIcon,
	EnvelopeClosedIcon,
} from '@radix-ui/react-icons';
import IconToggle from '../IconToggle';
import ThemeToggle from './ThemeToggle';

interface Props {
	children?: React.ReactNode;
	triggers?: React.ReactNode[];
}

const NavTopbar: React.FC<Props> = ({ children, triggers }) => {
	return (
		<div className="h-12 w-full px-2 flex justify-end items-center">
			<div className="flex-1 flex items-center gap-2">
				<IconToggle onClick={() => {}}>
					<DragHandleHorizontalIcon className="w-5 h-5" />
				</IconToggle>
				<div className="flex-1">{children}</div>
			</div>
			<div className="flex justify-end items-center gap-2">
				{triggers}
				<IconToggle onClick={() => {}}>
					<EnvelopeClosedIcon className="w-5 h-5" />
				</IconToggle>
				<ThemeToggle />
			</div>
		</div>
	);
};

export default NavTopbar;
