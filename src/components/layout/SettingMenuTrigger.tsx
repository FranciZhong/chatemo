'use client';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ModalType, ProfileModalTab } from '@/lib/constants';
import useModalStore from '@/store/modalStore';
import useSocketStore from '@/store/socketStore';
import { GearIcon } from '@radix-ui/react-icons';
import { signOut } from 'next-auth/react';
import { Separator } from '../ui/separator';

const SettingMenuTrigger = () => {
	const { disconnect } = useSocketStore();
	const { openModal } = useModalStore();

	const handleSignOut = async () => {
		disconnect();
		await signOut();
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="icon-button" asChild>
				<GearIcon className="icon-size" />
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuGroup>
					{Object.values(ProfileModalTab).map((value) => (
						<DropdownMenuItem
							key={value}
							onClick={() => openModal(ModalType.PROFILE_MODAL, value)}
						>
							{value.toUpperCase()}
						</DropdownMenuItem>
					))}
				</DropdownMenuGroup>
				<Separator orientation="horizontal" />
				<DropdownMenuGroup>
					<DropdownMenuItem onClick={handleSignOut}>Logout</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default SettingMenuTrigger;
