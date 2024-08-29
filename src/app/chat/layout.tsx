'use server';

import ChatLayout from '@/components/layout/ChatLayout';
import userService from '@/server/services/userService';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { PageUrl } from '../../lib/constants';
import { authOptions } from '../api/auth/[...nextauth]/route';

interface Props {
	children: React.ReactNode;
}

const layout: React.FC<Props> = async ({ children }) => {
	const session = await getServerSession(authOptions);
	const userId = session?.user.id;
	if (!userId) {
		redirect(PageUrl.LOGIN);
	}

	const userProfile = await userService.getProfileById(userId);
	if (!userProfile) {
		redirect(PageUrl.LOGIN);
	}

	const notifications = await userService.getNotificationsByUserId(userId);

	return (
		<ChatLayout userProfile={userProfile} notifications={notifications}>
			{children}
		</ChatLayout>
	);
};

export default layout;
