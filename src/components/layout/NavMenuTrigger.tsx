'use client';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ModalType, NavModalTab } from '@/lib/constants';
import { useOpenModalStore } from '@/store/modalStore';
import { PlusIcon } from '@radix-ui/react-icons';

const NavMenuTrigger = () => {
	const openModal = useOpenModalStore();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="icon-button" asChild>
				<PlusIcon className="icon-size" />
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				{Object.values(NavModalTab).map((value) => (
					<DropdownMenuItem
						key={value}
						onClick={() => openModal(ModalType.NAV_MODAL, value)}
					>
						{value}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default NavMenuTrigger;
