'use client';

import { ModalType } from '@/lib/constants';
import { UserEvent } from '@/lib/events';
import useConversationStore from '@/store/conversationStore';
import useModalStore from '@/store/modalStore';
import useNotificationStore from '@/store/notificationStore';
import useSocketStore from '@/store/socketStore';
import useUserStore from '@/store/userStore';
import { ConversationZType } from '@/types/chat';
import { NotificationZType, UserProfileZType } from '@/types/user';
import { useEffect, useState } from 'react';
import LoadingPage from '../LoadingPage';
import NavModal from '../modal/NavModal';
import NotificationModal from '../modal/NotificationModal';
import { Separator } from '../ui/separator';
import { ToastAction } from '../ui/toast';
import { useToast } from '../ui/use-toast';
import NavSidebar from './NavSidebar';

interface Props {
	userProfile: UserProfileZType;
	notifications: NotificationZType[];
	conversations: ConversationZType[];
	children: React.ReactNode;
}

const ChatLayout: React.FC<Props> = (props) => {
	const [isLoading, setLoading] = useState(true);
	const { socket, connect } = useSocketStore();
	const { setProfile } = useUserStore();
	const { setNotifications, pushNotification } = useNotificationStore();
	const { setConversations, newConversation } = useConversationStore();
	const { toast } = useToast();
	const { openModal } = useModalStore();

	useEffect(() => {
		setLoading(false);
	}, []);

	// init stores
	useEffect(() => {
		setProfile(props.userProfile);
		setNotifications(props.notifications);
		setConversations(props.conversations);
	}, [props, setProfile, setNotifications]);

	// init socket and event listeners
	useEffect(() => {
		if (!socket) {
			connect(process.env.HOSTNAME || 'localhost:3000');
		} else {
			socket.on(UserEvent.NEW_NOTIFICATION, (payload: NotificationZType) => {
				pushNotification(payload);
				toast({
					title: payload.type,
					description: 'Check your notification box.',
					action: (
						<ToastAction
							onClick={() => openModal(ModalType.NOTIFICATION_MODAL)}
							altText="Details"
						>
							Details
						</ToastAction>
					),
				});
			});
			socket.on(UserEvent.NEW_FRIENDSHIP, (payload: ConversationZType) =>
				newConversation(payload)
			);
		}
	}, [socket, connect]);

	if (isLoading) {
		return <LoadingPage />;
	}

	return (
		<>
			<NavModal />
			<NotificationModal />
			<div className="w-screen h-screen flex">
				<NavSidebar />
				<Separator orientation="vertical" />
				<div className="flex-1">{props.children}</div>
			</div>
		</>
	);
};

export default ChatLayout;
