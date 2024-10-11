'use client';

import { ModalType } from '@/lib/constants';
import useModalStore from '@/store/modalStore';
import { PersonIcon } from '@radix-ui/react-icons';
import HoverTooltip from '../HoverTooltip';
import IconButton from '../IconButton';

const MembershipsTrigger: React.FC = () => {
	const { openModal } = useModalStore();

	return (
		<HoverTooltip content="Memebers">
			<IconButton onClick={() => openModal(ModalType.MEMBERSHIP_MODAL)}>
				<PersonIcon className="icon-size" />
			</IconButton>
		</HoverTooltip>
	);
};

export default MembershipsTrigger;
