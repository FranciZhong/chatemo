'use client';

import { ModalType } from '@/lib/constants';
import useChannelStore from '@/store/channelStore';
import useModalStore from '@/store/modalStore';
import { ChannelMembershipZType, ChannelZType } from '@/types/chat';
import { useParams } from 'next/navigation';
import MembershipCard from '../profile/MembershipCard';
import { ScrollArea } from '../ui/scroll-area';
import Modal from './Modal';

type ParamsType = {
	channelId: string;
};

const MembershipsModal: React.FC = () => {
	const params = useParams<ParamsType>();
	const { isOpen, modalType, closeModal } = useModalStore();
	const { channels } = useChannelStore();

	if (!isOpen || modalType !== ModalType.MEMBERSHIP_MODAL) {
		return null;
	}

	if (!params) {
		return null;
	}

	const channelId = params.channelId;
	const channel: ChannelZType = channels.find((item) => item.id === channelId)!;
	if (!channel) {
		return null;
	}

	const memberships: ChannelMembershipZType[] = channel.memberships || [];

	return (
		<Modal
			open={isOpen}
			onClose={closeModal}
			justifyContent="end"
			className="max-w-md"
			topLeft={<h1 className="p-2 text-2xl">Members</h1>}
		>
			<ScrollArea className="w-full h-full">
				<div className="p-2 flex flex-col gap-2">
					{memberships.map((membership) => (
						<MembershipCard
							key={membership.id}
							membership={membership}
							ownerId={channel.ownerId}
						/>
					))}
				</div>
			</ScrollArea>
		</Modal>
	);
};

export default MembershipsModal;
