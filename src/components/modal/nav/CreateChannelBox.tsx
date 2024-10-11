'use client';

import { toast } from '@/components/ui/use-toast';
import axiosInstance from '@/lib/axios';
import { ApiUrl, NavModalTab, TOAST_ERROR_DEFAULT } from '@/lib/constants';
import { ChannelEvent } from '@/lib/events';
import useChannelStore from '@/store/channelStore';
import useModalStore from '@/store/modalStore';
import useSocketStore from '@/store/socketStore';
import { ChannelPayload, ChannelZType } from '@/types/chat';
import { FormatResponse } from '@/types/common';
import ChannelProfileForm from '../form/ChannelProfileForm';

const CreateChannelBox: React.FC = () => {
	const { socket } = useSocketStore();
	const { newChannel } = useChannelStore();
	const { closeModal } = useModalStore();

	const onSubmit = async (values: ChannelPayload) => {
		try {
			const response = await axiosInstance.post<FormatResponse<ChannelZType>>(
				ApiUrl.CREATE_CHANNEL,
				values
			);

			const channel = response.data.data;
			if (channel) {
				newChannel(channel);
				closeModal();
				socket?.emit(ChannelEvent.JOIN_CHANNEL_ROOM, channel.id);
			}
		} catch (error) {
			toast(TOAST_ERROR_DEFAULT);
		}
	};

	return (
		<div className="flex flex-col gap-8">
			<h2 className="heading">
				{NavModalTab.CREATE_CHANNEL.toLocaleUpperCase()}
			</h2>
			<ChannelProfileForm onSubmit={onSubmit} buttonText="Create" />
		</div>
	);
};

export default CreateChannelBox;
