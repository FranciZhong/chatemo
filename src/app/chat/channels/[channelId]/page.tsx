'use server';

import ChannelBox from '@/components/chat/ChannelBox';
import NavTopbar from '@/components/layout/NavTopbar';
import { Separator } from '@/components/ui/separator';
import { PageUrl } from '@/lib/constants';
import { NotFoundError } from '@/server/error';
import channelService from '@/server/services/channelService';
import { notFound, redirect } from 'next/navigation';

interface Props {
	params: {
		channelId: string;
	};
}

const page: React.FC<Props> = async ({ params: { channelId } }) => {
	try {
		await channelService.getChannelById(channelId);

		return (
			<div className="h-full w-full flex flex-col">
				<NavTopbar />
				<Separator orientation="horizontal" />
				<div className="flex-1 overflow-hidden">
					<ChannelBox channelId={channelId} />
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
