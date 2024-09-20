'use client';

import { toast } from '@/components/ui/use-toast';
import axiosInstance from '@/lib/axios';
import { ApiUrl, NavModalTab } from '@/lib/constants';
import { ChannelEvent } from '@/lib/events';
import useChannelStore from '@/store/channelStore';
import useModalStore from '@/store/modalStore';
import useSocketStore from '@/store/socketStore';
import { ChannelPayload, ChannelZType } from '@/types/chat';
import { FormatResponse } from '@/types/common';
import ChannelForm from '../form/ChannelForm';

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
			toast({
				title: 'Error',
				description: 'Something went wrong.',
			});
		}
	};

	return (
		<div className="flex flex-col gap-8">
			<h2 className="heading">
				{NavModalTab.CREATE_CHANNEL.toLocaleUpperCase()}
			</h2>
			<ChannelForm onSubmit={onSubmit} />
		</div>
	);
};

export default CreateChannelBox;
