import { Avatar, AvatarImage } from '@/components/ui/avatar';
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Skeleton } from '@/components/ui/skeleton';
import { AvatarSize, ImgUrl } from '@/lib/constants';
import { parseFotmatedDate } from '@/lib/date';
import { cn, getAvatarSizeStyle } from '@/lib/utils';
import { UserZType } from '@/types/user';
import { CalendarIcon } from '@radix-ui/react-icons';
import { useCallback } from 'react';

interface Props {
	user?: UserZType | null;
	isCurrent?: boolean;
	size?: AvatarSize;
	children?: React.ReactNode;
}

const UserCard: React.FC<Props> = ({
	user,
	isCurrent = false,
	size = AvatarSize.MD,
	children,
}) => {
	const getAvatar = useCallback(
		(size: AvatarSize) =>
			isCurrent ? (
				<Avatar
					className={cn(
						'bg-primary hover:bg-secondary',
						getAvatarSizeStyle(size)
					)}
				>
					<Skeleton>
						<AvatarImage src={user?.image || ImgUrl.USER_AVATAR_ALT} />
					</Skeleton>
				</Avatar>
			) : (
				<Avatar className={cn('bg-secondary', getAvatarSizeStyle(size))}>
					<AvatarImage src={user?.image || ImgUrl.USER_AVATAR_ALT} />
				</Avatar>
			),
		[isCurrent, user]
	);

	return (
		<HoverCard>
			<div className="w-full h-full flex gap-2 items-center">
				<HoverCardTrigger asChild>{getAvatar(size)}</HoverCardTrigger>
				<div className="w-32">
					<h5 className="font-semibold text-single-line">{user?.name}</h5>
					{children}
				</div>
			</div>
			<HoverCardContent className="md:w-96">
				<div className="flex justify-between space-x-4">
					{getAvatar(AvatarSize.LG)}
					<div className="flex-1 space-y-1">
						<h4 className="text-md font-semibold text-single-line">
							{user?.name}
						</h4>
						<p className="text-sm">
							{user?.description && user?.description?.length > 256
								? user?.description?.slice(0, 253) + '...'
								: user?.description}
						</p>
						{user?.createdAt && (
							<div className="flex items-center pt-2 gap-1">
								<CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
								<span className="text-xs text-opacity-70">
									Joined {parseFotmatedDate(user?.createdAt)}
								</span>
							</div>
						)}
					</div>
				</div>
			</HoverCardContent>
		</HoverCard>
	);
};

export default UserCard;
