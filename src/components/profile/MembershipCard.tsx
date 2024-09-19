'use client';

import axiosInstance from '@/lib/axios';
import { ApiUrl } from '@/lib/constants';
import useUserStore from '@/store/userStore';
import { ChannelMembershipZType } from '@/types/chat';
import { FormatResponse, IdPayload } from '@/types/common';
import { CrownIcon } from 'lucide-react';
import { useRef } from 'react';
import ItemContainer from '../ItemContainer';
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from '../ui/context-menu';
import { toast } from '../ui/use-toast';
import WarningTrigger from '../WarningTrigger';
import UserCard from './UserCard';

interface Props {
	membership: ChannelMembershipZType;
	ownerId: string;
}

const MembershipCard: React.FC<Props> = ({ membership, ownerId }) => {
	const deleteWarningRef = useRef<HTMLDivElement>(null);
	const { user } = useUserStore();
	const isOwner = user!.id === ownerId;
	const isSelf = user!.id === membership.userId;

	const handleRemoveMembership = async () => {
		try {
			axiosInstance.post<FormatResponse<any>>(
				ApiUrl.REMOVE_CHANNEL_MEMBERSHIP,
				{
					referToId: membership.id,
				} as IdPayload
			);
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Something went wrong.',
			});
		}
	};

	return (
		<div>
			<ContextMenu>
				<ContextMenuTrigger>
					<ItemContainer className="p-2 flex items-center justify-between">
						<div className="flex-1">
							<UserCard user={membership.user!} />
						</div>
						{ownerId === membership.userId && <CrownIcon />}
					</ItemContainer>
				</ContextMenuTrigger>
				<ContextMenuContent>
					<ContextMenuItem>Connect</ContextMenuItem>
					{isOwner && !isSelf && (
						<ContextMenuItem
							onClick={() => deleteWarningRef.current?.click()}
							className="focus:bg-accent"
						>
							Remove
						</ContextMenuItem>
					)}
				</ContextMenuContent>
			</ContextMenu>
			<WarningTrigger onContinue={handleRemoveMembership}>
				<div ref={deleteWarningRef} />
			</WarningTrigger>
		</div>
	);
};

export default MembershipCard;
