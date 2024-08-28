import { AvatarSize, ImgUrl } from '@/app/constants';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Skeleton } from '@/components/ui/skeleton';
import { parseFotmatedDate } from '@/lib/date';
import { cn } from '@/lib/utils';
import { UserZType } from '@/types/user';
import { CalendarIcon } from '@radix-ui/react-icons';
import { useCallback } from 'react';

interface Props {
	user?: UserZType | null;
	isCurrent?: boolean;
	children?: React.ReactNode;
}

const UserCard: React.FC<Props> = ({ user, isCurrent = false, children }) => {
	const getSizeStyle = (size: AvatarSize) => {
		switch (size) {
			case AvatarSize.LG:
				return 'h-16 w-16';
			case AvatarSize.SM:
				return 'h-8 w-8';
			default:
				return 'h-10 w-10';
		}
	};

	const getAvatar = useCallback(
		(size: AvatarSize) =>
			isCurrent ? (
				<Avatar
					className={cn('bg-primary hover:bg-secondary', getSizeStyle(size))}
				>
					<Skeleton>
						<AvatarImage src={user?.image || ImgUrl.USER_AVATAR_ALT} />
					</Skeleton>
				</Avatar>
			) : (
				<Avatar className={cn('bg-secondary', getSizeStyle(size))}>
					<AvatarImage src={user?.image || ImgUrl.USER_AVATAR_ALT} />
				</Avatar>
			),
		[isCurrent, user]
	);

	return (
		<HoverCard>
			<HoverCardTrigger asChild>
				<div className="flex gap-2 items-center">
					{getAvatar(AvatarSize.MD)}
					<div className="flex flex-col">
						<div className="font-semibold">{user?.name}</div>
						{children}
					</div>
				</div>
			</HoverCardTrigger>
			<HoverCardContent className="md:w-80">
				<div className="flex justify-between space-x-4">
					{getAvatar(AvatarSize.LG)}
					<div className="flex-1 space-y-1">
						<h4 className="text-md font-semibold">{user?.name}</h4>
						<p className="text-sm">{user?.description}</p>
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
