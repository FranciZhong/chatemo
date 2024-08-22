import { ImgUrl } from '@/app/constants';
import { GearIcon, MagnifyingGlassIcon, PlusIcon } from '@radix-ui/react-icons';
import IconToggle from '../IconToggle';
import ItemContainer from '../ItemContainer';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Skeleton } from '../ui/skeleton';

const UserBar: React.FC = () => {
	return (
		<div className="h-16 w-full px-4 flex justify-between items-center">
			<ItemContainer className="px-2 py-1 flex gap-2 items-center">
				<Avatar className="h-10 w-10 rounded-full bg-primary hover:bg-secondary">
					<Skeleton>
						<AvatarImage
							className="rounded-full"
							src={ImgUrl.USER_AVATAR_ALT}
						/>
					</Skeleton>
				</Avatar>
				<div className="flex flex-col">
					<div className="font-semibold">username</div>
					<div className="text-secondary text-sm font-light">online</div>
				</div>
			</ItemContainer>
			<div className="flex items-center gap-2">
				<IconToggle onClick={() => {}}>
					<PlusIcon className="h-5 w-5" />
				</IconToggle>
				<IconToggle onClick={() => {}}>
					<MagnifyingGlassIcon className="h-5 w-5" />
				</IconToggle>
				<IconToggle onClick={() => {}}>
					<GearIcon className="h-5 w-5" />
				</IconToggle>
			</div>
		</div>
	);
};

export default UserBar;
