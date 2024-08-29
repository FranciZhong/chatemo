'use client';

import { ModalType } from '@/lib/constants';
import { useOpenModalStore } from '@/store/modalStore';
import {
	DragHandleHorizontalIcon,
	EnvelopeClosedIcon,
} from '@radix-ui/react-icons';
import IconButton from '../IconButton';
import ThemeToggle from './ThemeToggle';

interface Props {
	children?: React.ReactNode;
	triggers?: React.ReactNode[];
}

const NavTopbar: React.FC<Props> = ({ children, triggers }) => {
	const openModal = useOpenModalStore();

	return (
		<div className="h-12 w-full px-2 flex justify-end items-center">
			<div className="flex-1 flex items-center gap-2">
				<IconButton onClick={() => {}}>
					<DragHandleHorizontalIcon className="icon-size" />
				</IconButton>
				<div className="flex-1">{children}</div>
			</div>
			<div className="flex justify-end items-center gap-2">
				{triggers}
				<IconButton onClick={() => openModal(ModalType.NOTIFICATION_MODAL)}>
					<EnvelopeClosedIcon className="icon-size" />
				</IconButton>
				<ThemeToggle />
			</div>
		</div>
	);
};

export default NavTopbar;
