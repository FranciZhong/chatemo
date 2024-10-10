'use client';

import axiosInstance from '@/lib/axios';
import { ApiUrl, ModalType, TOAST_ERROR_DEFAULT } from '@/lib/constants';
import useChannelStore from '@/store/channelStore';
import useModalStore from '@/store/modalStore';
import {
	ChannelPayload,
	ChannelZType,
	UpdateChannelPayload,
} from '@/types/chat';
import { FormatResponse } from '@/types/common';
import { useParams } from 'next/navigation';
import { ScrollArea } from '../ui/scroll-area';
import { toast } from '../ui/use-toast';
import ChannelProfileForm from './form/ChannelProfileForm';
import Modal from './Modal';

type ParamsType = {
	channelId: string;
};

const ChannelSettingModal: React.FC = () => {
	const params = useParams<ParamsType>();
	const { isOpen, modalType, closeModal } = useModalStore();
	const { channels, updateChannel } = useChannelStore();

	if (!isOpen || modalType !== ModalType.CHANNEL_SETTING_MODAL) {
		return null;
	}

	if (!params) {
		return null;
	}

	const channel = channels.find((item) => item.id === params.channelId);
	if (!channel) {
		return null;
	}

	const handleUpdateProfile = async (values: ChannelPayload) => {
		try {
			const response = await axiosInstance.post<FormatResponse<ChannelZType>>(
				ApiUrl.UPDATE_CHANNEL_PROFILE,
				{
					channelId: params.channelId,
					...values,
				} as UpdateChannelPayload
			);

			const channel = response.data.data!;
			updateChannel(channel);
		} catch (error) {
			toast(TOAST_ERROR_DEFAULT);
		}
	};

	return (
		<Modal
			open={isOpen}
			onClose={closeModal}
			justifyContent="end"
			className="max-w-md"
			topLeft={<h1 className="p-2 text-2xl">Channel Information</h1>}
		>
			<ScrollArea className="w-full h-full">
				<div className="p-4 flex flex-col gap-8">
					<ChannelProfileForm
						onSubmit={handleUpdateProfile}
						buttonText="Update"
						channel={channel}
					/>
				</div>
			</ScrollArea>
		</Modal>
	);
};

export default ChannelSettingModal;
