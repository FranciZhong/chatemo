'use client';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PlusIcon } from '@radix-ui/react-icons';

const PlusMenuTrigger = () => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="icon-button" asChild>
				<PlusIcon className="icon-size" />
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-36">
				<DropdownMenuItem>Find friend</DropdownMenuItem>
				<DropdownMenuItem>Creat channel</DropdownMenuItem>
				<DropdownMenuItem>Join channel</DropdownMenuItem>
				<DropdownMenuItem>Set up agent</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default PlusMenuTrigger;
