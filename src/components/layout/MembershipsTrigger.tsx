'use client';

import { ModalType } from '@/lib/constants';
import useModalStore from '@/store/modalStore';
import { UserRoundSearchIcon } from 'lucide-react';
import HoverTooltip from '../HoverTooltip';
import IconButton from '../IconButton';

const MembershipsTrigger: React.FC = () => {
	const { openModal } = useModalStore();

	return (
		<HoverTooltip content="Memebers">
			<IconButton onClick={() => openModal(ModalType.MEMBERSHIP_MODAL)}>
				<UserRoundSearchIcon className="icon-size" />
			</IconButton>
		</HoverTooltip>
	);
};

export default MembershipsTrigger;
