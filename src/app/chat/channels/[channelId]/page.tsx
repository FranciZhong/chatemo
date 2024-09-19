'use server';

import ChannelBox from '@/components/chat/ChannelBox';
import MembershipsTrigger from '@/components/layout/MembershipsTrigger';
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
		// check exist and throw not found
		await channelService.getChannelById(channelId, false);

		const NavTopTriggers: React.ReactNode[] = [
			<MembershipsTrigger key="memberships-trigger" />,
		];

		return (
			<div className="h-full w-full flex flex-col">
				<NavTopbar triggers={NavTopTriggers} />
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
