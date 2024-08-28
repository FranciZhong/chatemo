'use client';

import useNotificationStore from '@/store/notificationStore';
import useUserStore from '@/store/userStore';
import { NotificationZType, UserProfileZType } from '@/types/user';
import { useEffect } from 'react';
import NavModal from '../modal/NavModal';
import NotificationModal from '../modal/NotificationModal';
import { Separator } from '../ui/separator';
import NavSidebar from './NavSidebar';

interface Props {
	userProfile: UserProfileZType;
	notifications: NotificationZType[];
	children: React.ReactNode;
}

const ChatLayout: React.FC<Props> = ({
	userProfile,
	notifications,
	children,
}) => {
	const { setProfile } = useUserStore();
	const { setNotifications } = useNotificationStore();

	useEffect(() => {
		setProfile(userProfile);
	}, [userProfile, setProfile]);

	useEffect(() => {
		setNotifications(notifications);
	}, [notifications, setNotifications]);

	return (
		<>
			<NavModal />
			<NotificationModal />
			<div className="w-screen h-screen flex">
				<NavSidebar />
				<Separator orientation="vertical" />
				<div className="flex-1">{children}</div>
			</div>
		</>
	);
};

export default ChatLayout;
