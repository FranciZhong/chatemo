'use client';

import { ModalType } from '@/lib/constants';
import useModalStore from '@/store/modalStore';
import { EditIcon } from 'lucide-react';
import HoverTooltip from '../HoverTooltip';
import IconButton from '../IconButton';

const AgentSettingTrigger: React.FC = () => {
	const { openModal } = useModalStore();

	return (
		<HoverTooltip content="Edit Agent">
			<IconButton onClick={() => openModal(ModalType.AGENT_SETTING_MODAL)}>
				<EditIcon className="icon-size" />
			</IconButton>
		</HoverTooltip>
	);
};

export default AgentSettingTrigger;
