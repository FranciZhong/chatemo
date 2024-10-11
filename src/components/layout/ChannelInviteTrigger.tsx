'use client';

import { ModalType } from '@/lib/constants';
import useModalStore from '@/store/modalStore';
import { PlusIcon } from '@radix-ui/react-icons';
import HoverTooltip from '../HoverTooltip';
import IconButton from '../IconButton';

const ChannelInviteTrigger: React.FC = () => {
	const { openModal } = useModalStore();

	return (
		<HoverTooltip content="Invite Users to Channel">
			<IconButton onClick={() => openModal(ModalType.CHANNEL_INVITE_MODAL)}>
				<PlusIcon className="icon-size" />
			</IconButton>
		</HoverTooltip>
	);
};

export default ChannelInviteTrigger;
