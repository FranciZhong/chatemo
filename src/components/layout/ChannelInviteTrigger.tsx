'use client';

import { ModalType } from '@/lib/constants';
import useModalStore from '@/store/modalStore';
import { PlusIcon } from '@radix-ui/react-icons';
import IconButton from '../IconButton';

const ChannelInviteTrigger: React.FC = () => {
	const { openModal } = useModalStore();

	return (
		<IconButton onClick={() => openModal(ModalType.CHANNEL_INVITE_MODAL)}>
			<PlusIcon className="icon-size" />
		</IconButton>
	);
};

export default ChannelInviteTrigger;
