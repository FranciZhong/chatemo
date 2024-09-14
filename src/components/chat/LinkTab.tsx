import { AvatarSize } from '@/lib/constants';
import { cn, getAvatarSizeStyle } from '@/lib/utils';
import Link from 'next/link';
import ItemContainer from '../ItemContainer';
import { Avatar, AvatarImage } from '../ui/avatar';

interface Props {
	href: string;
	image?: string;
	title?: string;
	description?: string;
}

const LinkTab: React.FC<Props> = ({ href, image, title, description }) => {
	return (
		<Link href={href}>
			<ItemContainer className="p-2 w-full h-16 hover:cursor-pointer">
				<div className="w-full h-full flex gap-2 items-center">
					<Avatar
						className={cn('bg-secondary', getAvatarSizeStyle(AvatarSize.MD))}
					>
						<AvatarImage src={image} />
					</Avatar>
					<div className="w-60">
						<h5 className="font-semibold text-single-line">{title}</h5>
						<p className="text-single-line text-sm text-foreground/60 font-light">
							{description}
						</p>
					</div>
				</div>
			</ItemContainer>
		</Link>
	);
};

export default LinkTab;
