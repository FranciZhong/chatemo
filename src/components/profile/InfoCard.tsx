import { Avatar, AvatarImage } from '@/components/ui/avatar';
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from '@/components/ui/hover-card';
import { AvatarSize } from '@/lib/constants';
import { cn, getAvatarSizeStyle } from '@/lib/utils';
import { CalendarIcon } from '@radix-ui/react-icons';
import { useCallback } from 'react';
import { Skeleton } from '../ui/skeleton';

interface Props {
	image: string;
	name?: string | null;
	description?: string | null;
	createdAt?: string;
	size?: AvatarSize;
	skeleton?: boolean;
	children?: React.ReactNode;
}

const InfoCard: React.FC<Props> = ({
	image,
	name,
	description,
	createdAt,
	size = AvatarSize.MD,
	skeleton = false,
	children,
}) => {
	const getAvatar = useCallback(
		(size: AvatarSize) =>
			skeleton ? (
				<Avatar
					className={cn(
						'bg-primary hover:bg-secondary',
						getAvatarSizeStyle(size)
					)}
				>
					<Skeleton>
						<AvatarImage src={image} />
					</Skeleton>
				</Avatar>
			) : (
				<Avatar className={cn('bg-secondary', getAvatarSizeStyle(size))}>
					<AvatarImage src={image} />
				</Avatar>
			),
		[image, skeleton]
	);

	return (
		<HoverCard>
			<div className="w-full h-full flex gap-2 items-center">
				<HoverCardTrigger asChild>{getAvatar(size)}</HoverCardTrigger>
				<div className="w-32">
					<h5 className="font-semibold text-single-line">{name}</h5>
					{children}
				</div>
			</div>
			<HoverCardContent className="md:w-96">
				<div className="flex justify-between space-x-4">
					{getAvatar(AvatarSize.LG)}
					<div className="flex-1 space-y-1">
						<h4 className="text-md font-semibold text-single-line">{name}</h4>
						<p className="text-sm">
							{description && description?.length > 256
								? description?.slice(0, 253) + '...'
								: description}
						</p>
						{createdAt && (
							<div className="flex items-center pt-2 gap-1">
								<CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
								<span className="text-xs text-opacity-70">{createdAt}</span>
							</div>
						)}
					</div>
				</div>
			</HoverCardContent>
		</HoverCard>
	);
};

export default InfoCard;
