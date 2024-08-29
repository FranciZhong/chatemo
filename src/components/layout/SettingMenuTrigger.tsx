'use client';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useSocketStore from '@/store/socketStore';
import { GearIcon } from '@radix-ui/react-icons';
import { signOut } from 'next-auth/react';

const SettingMenuTrigger = () => {
	const { disconnect } = useSocketStore();

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
					<DropdownMenuItem>Profile</DropdownMenuItem>
					<DropdownMenuItem>API Keys</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuGroup>
					<DropdownMenuItem onClick={handleSignOut}>Logout</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default SettingMenuTrigger;
