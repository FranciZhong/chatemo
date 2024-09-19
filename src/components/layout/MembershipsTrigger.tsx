'use client';

import { ModalType } from '@/lib/constants';
import useModalStore from '@/store/modalStore';
import { PersonIcon } from '@radix-ui/react-icons';
import IconButton from '../IconButton';

const MembershipsTrigger: React.FC = () => {
	const { openModal } = useModalStore();

	return (
		<IconButton onClick={() => openModal(ModalType.MEMBERSHIP_MODAL)}>
			<PersonIcon className="icon-size" />
		</IconButton>
	);
};

export default MembershipsTrigger;
