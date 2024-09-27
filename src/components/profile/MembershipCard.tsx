'use client';

import axiosInstance from '@/lib/axios';
import {
	ApiUrl,
	CLOSE_CHANNEL_WARNING_DESC,
	TOAST_ERROR_DEFAULT,
} from '@/lib/constants';
import useConversationStore from '@/store/conversationStore';
import useUserStore from '@/store/userStore';
import { ChannelMembershipZType } from '@/types/chat';
import {
	FormatResponse,
	IdPayload,
	ParentChildIdPayload,
} from '@/types/common';
import { CrownIcon } from 'lucide-react';
import { memo, useCallback, useRef } from 'react';
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
	const asignOwnershipWarningRef = useRef<HTMLDivElement | null>(null);
	const leaveWarningRef = useRef<HTMLDivElement | null>(null);
	const removeWarningRef = useRef<HTMLDivElement | null>(null);
	const closeWarningRef = useRef<HTMLDivElement | null>(null);
	const { user } = useUserStore();
	const {} = useConversationStore();
	const isOwner = user!.id === ownerId;
	const isSelf = user!.id === membership.userId;

	const handleConnect = useCallback(async () => {
		try {
			await axiosInstance.post<FormatResponse<any>>(
				ApiUrl.SEND_FRIEND_REQUEST,
				{ referToId: membership.userId } as IdPayload
			);
		} catch (error) {
			toast(TOAST_ERROR_DEFAULT);
		}
	}, [membership]);

	const handleRemoveMembership = useCallback(async () => {
		try {
			await axiosInstance.post<FormatResponse<any>>(
				ApiUrl.REMOVE_CHANNEL_MEMBERSHIP,
				{
					referToId: membership.id,
				} as IdPayload
			);
		} catch (error) {
			toast(TOAST_ERROR_DEFAULT);
		}
	}, [membership]);

	const handleLeaveChannel = useCallback(async () => {
		try {
			await axiosInstance.post<FormatResponse<any>>(ApiUrl.LEAVE_CHANNEL, {
				referToId: membership.channelId,
			} as IdPayload);
		} catch (error) {
			toast(TOAST_ERROR_DEFAULT);
		}
	}, [membership]);

	const handleAsignOwnership = useCallback(async () => {
		try {
			await axiosInstance.post<FormatResponse<any>>(ApiUrl.ASSIGN_OWNERSHIP, {
				parentId: membership.channelId,
				childId: membership.userId,
			} as ParentChildIdPayload);
		} catch (error) {
			toast(TOAST_ERROR_DEFAULT);
		}
	}, [membership]);

	const handleCloseChannel = useCallback(async () => {
		try {
			await axiosInstance.post<FormatResponse<any>>(ApiUrl.CLOSE_CHANNEL, {
				referToId: membership.channelId,
			} as IdPayload);
		} catch (error) {
			toast(TOAST_ERROR_DEFAULT);
		}
	}, [membership]);

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
					{!isSelf && (
						<ContextMenuItem onClick={handleConnect}>Connect</ContextMenuItem>
					)}
					{isOwner && !isSelf && (
						<ContextMenuItem
							onClick={() => asignOwnershipWarningRef.current?.click()}
						>
							Asign Ownnership
						</ContextMenuItem>
					)}
					{!isOwner && isSelf && (
						<ContextMenuItem
							onClick={() => leaveWarningRef.current?.click()}
							className="focus:bg-accent"
						>
							Leave Channel
						</ContextMenuItem>
					)}
					{isOwner && !isSelf && (
						<ContextMenuItem
							onClick={() => removeWarningRef.current?.click()}
							className="focus:bg-accent"
						>
							Remove Member
						</ContextMenuItem>
					)}
					{isOwner && isSelf && (
						<ContextMenuItem
							onClick={() => closeWarningRef.current?.click()}
							className="focus:bg-accent"
						>
							Close Channel
						</ContextMenuItem>
					)}
				</ContextMenuContent>
			</ContextMenu>
			<WarningTrigger onContinue={handleLeaveChannel}>
				<div ref={leaveWarningRef} />
			</WarningTrigger>
			<WarningTrigger onContinue={handleRemoveMembership}>
				<div ref={removeWarningRef} />
			</WarningTrigger>
			<WarningTrigger onContinue={handleAsignOwnership}>
				<div ref={asignOwnershipWarningRef} />
			</WarningTrigger>
			<WarningTrigger
				onContinue={handleCloseChannel}
				description={CLOSE_CHANNEL_WARNING_DESC}
			>
				<div ref={closeWarningRef} />
			</WarningTrigger>
		</div>
	);
};

export default memo(MembershipCard);
