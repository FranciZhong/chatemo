'use client';

import { ModalType } from '@/lib/constants';
import useModalStore from '@/store/modalStore';
import { EditIcon } from 'lucide-react';
import HoverTooltip from '../HoverTooltip';
import IconButton from '../IconButton';

const ChannelSettingTrigger: React.FC = () => {
	const { openModal } = useModalStore();

	return (
		<HoverTooltip content="Edit Channel">
			<IconButton onClick={() => openModal(ModalType.CHANNEL_SETTING_MODAL)}>
				<EditIcon className="icon-size" />
			</IconButton>
		</HoverTooltip>
	);
};

export default ChannelSettingTrigger;
