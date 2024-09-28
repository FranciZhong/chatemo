'use client';

import { Badge } from '@/components/ui/badge';
import axiosInstance from '@/lib/axios';
import {
	ApiUrl,
	CLOSE_CHANNEL_WARNING_DESC,
	ImgUrl,
	PageUrl,
	TOAST_ERROR_DEFAULT,
} from '@/lib/constants';
import { cn } from '@/lib/utils';
import useUserStore from '@/store/userStore';
import { ChannelZType } from '@/types/chat';
import { FormatResponse, IdPayload } from '@/types/common';
import { useCallback, useRef } from 'react';
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from '../ui/context-menu';
import { toast } from '../ui/use-toast';
import WarningTrigger from '../WarningTrigger';
import LinkTab from './LinkTab';

interface Props {
	channel: ChannelZType;
}

const ChannelLink: React.FC<Props> = ({ channel }) => {
	const { user } = useUserStore();
	const leaveWarningRef = useRef<HTMLDivElement | null>(null);
	const closeWarningRef = useRef<HTMLDivElement | null>(null);

	const handleLeave = useCallback(async () => {
		try {
			await axiosInstance.post<FormatResponse<any>>(ApiUrl.LEAVE_CHANNEL, {
				referToId: channel.id,
			} as IdPayload);
		} catch (error) {
			toast(TOAST_ERROR_DEFAULT);
		}
	}, [channel]);

	const handleClose = useCallback(async () => {
		try {
			await axiosInstance.post<FormatResponse<any>>(ApiUrl.CLOSE_CHANNEL, {
				referToId: channel.id,
			} as IdPayload);
		} catch (error) {
			toast(TOAST_ERROR_DEFAULT);
		}
	}, [channel]);

	return (
		<div>
			<ContextMenu>
				<ContextMenuTrigger>
					<LinkTab
						href={PageUrl.CHANNELS + '/' + channel.id}
						image={channel.image || ImgUrl.CHANNEL_AVATAR_ALT}
						title={channel.name || ' '}
						description={
							<Badge
								className={cn(
									'w-16 justify-center',
									channel.type === 'PRIVATE' ? 'bg-secondary' : 'bg-primary'
								)}
							>
								{channel.type}
							</Badge>
						}
					/>
				</ContextMenuTrigger>
				<ContextMenuContent>
					<ContextMenuItem
						onClick={() => leaveWarningRef.current?.click()}
						className="focus:bg-accent"
					>
						Leave
					</ContextMenuItem>
					{user?.id === channel.ownerId && (
						<ContextMenuItem
							onClick={() => closeWarningRef.current?.click()}
							className="focus:bg-accent"
						>
							Close
						</ContextMenuItem>
					)}
				</ContextMenuContent>
			</ContextMenu>
			<WarningTrigger onContinue={handleLeave}>
				<div ref={leaveWarningRef} />
			</WarningTrigger>
			<WarningTrigger
				onContinue={handleClose}
				description={CLOSE_CHANNEL_WARNING_DESC}
			>
				<div ref={closeWarningRef} />
			</WarningTrigger>
		</div>
	);
};

export default ChannelLink;
