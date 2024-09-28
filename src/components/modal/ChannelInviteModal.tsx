'use client';

import axiosInstance from '@/lib/axios';
import { ApiUrl, ModalType, TOAST_ERROR_DEFAULT } from '@/lib/constants';
import useModalStore from '@/store/modalStore';
import { FormatResponse, ParentChildIdPayload } from '@/types/common';
import { useParams } from 'next/navigation';
import SearchUserBox from '../SearchUserBox';
import { toast } from '../ui/use-toast';
import Modal from './Modal';

type ParamsType = {
	channelId: string;
};

const ChannelInviteModal: React.FC = () => {
	const { channelId } = useParams() as ParamsType;
	const { isOpen, modalType, closeModal } = useModalStore();

	if (!channelId) {
		return null;
	}

	if (!isOpen || modalType !== ModalType.CHANNEL_INVITE_MODAL) {
		return null;
	}

	const handleSendRequest = (userId: string) => async () => {
		try {
			await axiosInstance.post<FormatResponse<any>>(
				ApiUrl.SEND_CHANNEL_INVITE,
				{
					parentId: channelId,
					childId: userId,
				} as ParentChildIdPayload
			);
		} catch (error) {
			toast(TOAST_ERROR_DEFAULT);
		}
	};

	return (
		<Modal
			open={isOpen}
			onClose={closeModal}
			className="max-w-md md:max-w-2xl lg:max-w-4xl"
			topLeft={<h1 className="p-2 text-2xl">Invite People</h1>}
		>
			<div className="p-2 w-full h-full flex flex-col gap-4">
				<p className="text-md text-muted-foreground">
					You can invite people to join this channel with their username on
					Chatemo.
				</p>
				<SearchUserBox
					placeholder="Type username starting with..."
					handleSendRequest={handleSendRequest}
				/>
			</div>
		</Modal>
	);
};

export default ChannelInviteModal;
