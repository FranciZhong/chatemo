'use client';

import { ImgUrl, ModalType, NavModalTab } from '@/app/constants';
import { useOpenModalStore } from '@/store/modalStore';
import { GearIcon, PlusIcon } from '@radix-ui/react-icons';
import IconButton from '../IconButton';
import ItemContainer from '../ItemContainer';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Skeleton } from '../ui/skeleton';

const UserBar: React.FC = () => {
	const openModal = useOpenModalStore();

	return (
		<div className="h-16 w-full px-4 flex gap-2 justify-between items-center">
			<ItemContainer className="flex-1 px-2 py-1 flex gap-2 items-center">
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
				<IconButton
					onClick={() =>
						openModal(ModalType.NAV_MODAL, NavModalTab.FIND_FRIEND)
					}
				>
					<PlusIcon className="icon-size" />
				</IconButton>
				<IconButton>
					<GearIcon className="icon-size" />
				</IconButton>
			</div>
		</div>
	);
};

export default UserBar;
