'use server';

import ConversationBox from '@/components/chat/ConversationBox';
import NavTopbar from '@/components/layout/NavTopbar';
import { Separator } from '@/components/ui/separator';
import { PageUrl } from '@/lib/constants';
import { NotFoundError } from '@/server/error';
import conversationService from '@/server/services/conversationService';
import { notFound, redirect } from 'next/navigation';

interface Props {
	params: {
		conversationId: string;
	};
}

const page: React.FC<Props> = async ({ params: { conversationId } }) => {
	try {
		await conversationService.getConversationById(conversationId);

		return (
			<div className="h-full w-full flex flex-col">
				<NavTopbar />
				<Separator orientation="horizontal" />
				<div className="flex-1 overflow-hidden">
					<ConversationBox conversationId={conversationId} />
				</div>
			</div>
		);
	} catch (error) {
		console.error(error);
		if (error instanceof NotFoundError) {
			notFound();
		} else {
			redirect(PageUrl.CHAT);
		}
	}
};

export default page;
