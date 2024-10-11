'use client';

import { GITHUB_LINK, ModalType } from '@/lib/constants';
import { useOpenModalStore } from '@/store/modalStore';
import useOpenStore from '@/store/openStore';
import {
	DragHandleHorizontalIcon,
	EnvelopeClosedIcon,
	GitHubLogoIcon,
} from '@radix-ui/react-icons';
import Link from 'next/link';
import HoverTooltip from '../HoverTooltip';
import IconButton from '../IconButton';
import ThemeToggle from './ThemeToggle';

interface Props {
	children?: React.ReactNode;
	triggers?: React.ReactNode[];
}

const NavTopbar: React.FC<Props> = ({ children, triggers }) => {
	const openModal = useOpenModalStore();
	const { toggleOpenSidebar } = useOpenStore();

	return (
		<div className="h-12 w-full px-2 flex justify-end items-center">
			<div className="flex-1 flex items-center gap-2">
				<IconButton onClick={toggleOpenSidebar}>
					<DragHandleHorizontalIcon className="icon-size" />
				</IconButton>
				<div className="flex-1">{children}</div>
			</div>
			<div className="flex justify-end items-center gap-2">
				{triggers}
				<HoverTooltip content="Notifications">
					<IconButton onClick={() => openModal(ModalType.NOTIFICATION_MODAL)}>
						<EnvelopeClosedIcon className="icon-size" />
					</IconButton>
				</HoverTooltip>
				<HoverTooltip content="Github Repository">
					<IconButton>
						<Link type="" href={GITHUB_LINK}>
							<GitHubLogoIcon className="icon-size" />
						</Link>
					</IconButton>
				</HoverTooltip>
				<HoverTooltip content="Switch Theme">
					<ThemeToggle />
				</HoverTooltip>
			</div>
		</div>
	);
};

export default NavTopbar;
