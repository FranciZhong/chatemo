'use server';

import ChannelBox from '@/components/chat/ChannelBox';
import ChannelInviteTrigger from '@/components/layout/ChannelInviteTrigger';
import MembershipsTrigger from '@/components/layout/MembershipsTrigger';
import NavTopbar from '@/components/layout/NavTopbar';
import { Separator } from '@/components/ui/separator';
import { PageUrl } from '@/lib/constants';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { NotFoundError } from '@/server/error';
import channelService from '@/server/services/channelService';
import { getServerSession } from 'next-auth';
import { notFound, redirect } from 'next/navigation';

interface Props {
	params: {
		channelId: string;
	};
}

const page: React.FC<Props> = async ({ params: { channelId } }) => {
	try {
		// check if channel exist and throw not found
		const channel = await channelService.getChannelById(channelId, false);

		// check if membership exist and valid
		const session = await getServerSession(authOptions);
		const userId = session!.user.id;

		const membership = await channelService.getMembershipByChannelUser(
			channelId,
			userId
		);
		if (!membership || membership.valid !== 'VALID') {
			notFound();
		}

		const NavTopTriggers: React.ReactNode[] = [
			userId === channel.ownerId && (
				<ChannelInviteTrigger key="channel-invite-trigger" />
			),
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
