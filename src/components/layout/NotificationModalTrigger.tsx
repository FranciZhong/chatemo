'use client';

import { ModalType } from '@/lib/constants';
import { useOpenModalStore } from '@/store/modalStore';
import useNotificationStore from '@/store/notificationStore';
import { EnvelopeClosedIcon } from '@radix-ui/react-icons';
import HoverTooltip from '../HoverTooltip';
import IconButton from '../IconButton';

const NotificationModalTrigger: React.FC = () => {
	const openModal = useOpenModalStore();
	const { notifications } = useNotificationStore();

	return (
		<HoverTooltip content="Notifications">
			<IconButton
				className="relative"
				onClick={() => openModal(ModalType.NOTIFICATION_MODAL)}
			>
				<EnvelopeClosedIcon className="icon-size" />
				{notifications.length > 0 && (
					<div className="absolute w-2 h-2 rounded-full bg-accent top-1 right-1" />
				)}
			</IconButton>
		</HoverTooltip>
	);
};

export default NotificationModalTrigger;
