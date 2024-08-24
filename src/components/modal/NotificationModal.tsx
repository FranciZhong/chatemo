import { ModalType } from '@/app/constants';
import { useInModalStore } from '@/store/modalStore';
import NotificationCard from '../profile/NotificationCard';
import { ScrollArea } from '../ui/scroll-area';
import Modal from './Modal';

const NotificationModal: React.FC = () => {
	const { isOpen, modalType, closeModal } = useInModalStore();

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
					{Array.from({ length: 20 }, (_, index) => (
						<NotificationCard key={index}>Friend Request</NotificationCard>
					))}
				</div>
			</ScrollArea>
		</Modal>
	);
};

export default NotificationModal;
