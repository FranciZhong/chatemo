'use server';

import ChatLayout from '@/components/layout/ChatLayout';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import conversationService from '@/server/services/conversationService';
import userService from '@/server/services/userService';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { PageUrl } from '../../lib/constants';

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

	const conversations = await conversationService.getConversationsByUserId(
		userId
	);

	return (
		<ChatLayout
			userProfile={userProfile}
			notifications={notifications}
			conversations={conversations}
		>
			{children}
		</ChatLayout>
	);
};

export default layout;
