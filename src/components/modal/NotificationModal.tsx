import { ModalType } from '@/app/constants';
import useModalStore from '@/store/modalStore';
import useNotificationStore from '@/store/notificationStore';
import NotificationCard from '../profile/NotificationCard';
import { ScrollArea } from '../ui/scroll-area';
import Modal from './Modal';

const NotificationModal: React.FC = () => {
	const { isOpen, modalType, closeModal } = useModalStore();
	const { notifications } = useNotificationStore();

	if (!isOpen || modalType !== ModalType.NOTIFICATION_MODAL) {
		return null;
	}

	return (
		<Modal
			open={isOpen}
			onClose={closeModal}
			justifyContent="end"
			className="max-w-md"
			topLeft={<h1 className="px-2 text-2xl">Notifications</h1>}
		>
			<ScrollArea className="w-full h-full">
				<div className="p-2 flex flex-col gap-2">
					{notifications.map((notification) => (
						<NotificationCard
							key={notification.referToId}
							notification={notification}
						/>
					))}
				</div>
			</ScrollArea>
		</Modal>
	);
};

export default NotificationModal;
