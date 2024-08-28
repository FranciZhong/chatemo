'use client';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { GearIcon } from '@radix-ui/react-icons';
import { signOut } from 'next-auth/react';

const SettingMenuTrigger = () => {
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
					<DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default SettingMenuTrigger;
