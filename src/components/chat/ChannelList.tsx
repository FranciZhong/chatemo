'use client';

import IconButton from '@/components/IconButton';
import { Input } from '@/components/ui/input';
import { ModalType, NavModalTab } from '@/lib/constants';
import useModalStore from '@/store/modalStore';
import { PlusIcon } from '@radix-ui/react-icons';
import ChannelLink from './ChannelLink';

interface Props {}

const ChannelList: React.FC<Props> = ({}) => {
	const { openModal } = useModalStore();

	return (
		<div className="flex flex-col">
			<div className="flex justify-end items-center gap-2 px-4">
				<Input />
				<IconButton
					onClick={() =>
						openModal(ModalType.NAV_MODAL, NavModalTab.JOIN_CHANNEL)
					}
				>
					<PlusIcon className="icon-size" />
				</IconButton>
			</div>
			<div className="p-2 w-full h-full flex flex-col gap-1">
				<ChannelLink />
				<ChannelLink />
				<ChannelLink />
				<ChannelLink />
				<ChannelLink />
				<ChannelLink />
				<ChannelLink />
				<ChannelLink />
				<ChannelLink />
				<ChannelLink />
				<ChannelLink />
				<ChannelLink />
				<ChannelLink />
				<ChannelLink />
				<ChannelLink />
				<ChannelLink />
				<ChannelLink />
				<ChannelLink />
				<ChannelLink />
				<ChannelLink />
				<ChannelLink />
				<ChannelLink />
				<ChannelLink />
				<ChannelLink />
				<ChannelLink />
			</div>
		</div>
	);
};

export default ChannelList;
