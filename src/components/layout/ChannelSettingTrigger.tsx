'use client';

import { ModalType } from '@/lib/constants';
import useModalStore from '@/store/modalStore';
import { EditIcon } from 'lucide-react';
import IconButton from '../IconButton';

const ChannelSettingTrigger: React.FC = () => {
	const { openModal } = useModalStore();

	return (
		<IconButton onClick={() => openModal(ModalType.CHANNEL_SETTING_MODAL)}>
			<EditIcon className="icon-size" />
		</IconButton>
	);
};

export default ChannelSettingTrigger;
